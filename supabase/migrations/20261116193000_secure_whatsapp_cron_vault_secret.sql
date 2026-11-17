select vault.create_secret(
  replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  'spartan_cron_secret',
  'Autenticação interna do cron de lembretes WhatsApp da Funcional Spartan'
)
where not exists (select 1 from vault.secrets where name='spartan_cron_secret');

create or replace function public.verify_whatsapp_cron_secret(p_secret text)
returns boolean language sql security definer set search_path = ''
as $$
  select coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role'
    and p_secret is not null
    and p_secret = (select decrypted_secret from vault.decrypted_secrets where name='spartan_cron_secret' limit 1);
$$;
revoke all on function public.verify_whatsapp_cron_secret(text) from public, anon, authenticated;
grant execute on function public.verify_whatsapp_cron_secret(text) to service_role;
