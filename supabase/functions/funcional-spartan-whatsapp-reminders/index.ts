import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-spartan-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeBrazilPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  if (digits.length === 10 || digits.length === 11) digits = "55" + digits;
  if (digits.length < 12 || digits.length > 13) return null;
  return digits;
}

function brDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

function brl(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);

  const cronSecret = Deno.env.get("SPARTAN_CRON_SECRET");
  const providedSecret = req.headers.get("x-spartan-cron-secret");
  if (!cronSecret || !providedSecret || providedSecret !== cronSecret) {
    return json({ error: "Não autorizado" }, 401);
  }

  const accessToken = Deno.env.get("META_WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("META_WHATSAPP_PHONE_NUMBER_ID");
  const templateName = Deno.env.get("META_WHATSAPP_TEMPLATE_NAME") || "spartan_lembrete_mensalidade";
  const languageCode = Deno.env.get("META_WHATSAPP_TEMPLATE_LANGUAGE") || "pt_BR";
  const graphVersion = Deno.env.get("META_GRAPH_API_VERSION") || "v27.0";

  if (!accessToken || !phoneNumberId) {
    return json({
      error: "Configuração Meta incompleta",
      required: ["META_WHATSAPP_ACCESS_TOKEN", "META_WHATSAPP_PHONE_NUMBER_ID"],
      configured: { accessToken: Boolean(accessToken), phoneNumberId: Boolean(phoneNumberId), templateName },
    }, 503);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
  let serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!serviceKey && secretKeysRaw) {
    try {
      serviceKey = JSON.parse(secretKeysRaw).default || "";
    } catch {
      return json({ error: "SUPABASE_SECRET_KEYS inválido" }, 500);
    }
  }
  if (!supabaseUrl || !serviceKey) return json({ error: "Credenciais internas do Supabase indisponíveis" }, 500);

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: rows, error: claimError } = await supabase.rpc("claim_whatsapp_reminders", { p_limit: 25 });
  if (claimError) {
    console.error("Falha ao reservar lembretes", claimError.message);
    return json({ error: "Não foi possível reservar lembretes" }, 500);
  }

  const results = { claimed: rows?.length || 0, sent: 0, failed: 0 };
  for (const row of rows || []) {
    const phone = normalizeBrazilPhone(row.phone || "");
    if (!phone) {
      await supabase.rpc("complete_whatsapp_reminder", {
        p_queue_id: row.queue_id,
        p_success: false,
        p_error_message: "Telefone inválido: informe DDD e número com 10 ou 11 dígitos.",
      });
      results.failed++;
      continue;
    }

    const message = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: [{
          type: "body",
          parameters: [
            { type: "text", text: String(row.full_name || "Aluno Spartan").slice(0, 60) },
            { type: "text", text: brDate(row.due_date) },
            { type: "text", text: brl(Number(row.amount_cents)) },
          ],
        }],
      },
    };

    try {
      const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(message),
        signal: AbortSignal.timeout(15000),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        await supabase.rpc("complete_whatsapp_reminder", {
          p_queue_id: row.queue_id,
          p_success: false,
          p_error_message: String(payload?.error?.message || `Meta API HTTP ${response.status}`).slice(0, 1000),
        });
        results.failed++;
        continue;
      }
      await supabase.rpc("complete_whatsapp_reminder", {
        p_queue_id: row.queue_id,
        p_success: true,
        p_provider_message_id: payload?.messages?.[0]?.id || null,
      });
      results.sent++;
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erro de comunicação com a Meta";
      await supabase.rpc("complete_whatsapp_reminder", {
        p_queue_id: row.queue_id,
        p_success: false,
        p_error_message: detail.slice(0, 1000),
      });
      results.failed++;
    }
  }
  return json({ ok: true, ...results });
});
