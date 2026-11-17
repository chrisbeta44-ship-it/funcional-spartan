create extension if not exists pg_net with schema extensions;

alter table private.whatsapp_reminder_queue
  drop constraint if exists whatsapp_reminder_queue_subscription_id_due_date_key;
alter table private.whatsapp_reminder_queue
  add constraint whatsapp_reminder_queue_subscription_due_type_key
  unique (subscription_id, due_date, reminder_type);
alter table private.whatsapp_reminder_queue
  add column if not exists attempts integer not null default 0,
  add column if not exists last_attempt_at timestamptz;
alter table private.whatsapp_reminder_queue
  drop constraint if exists whatsapp_reminder_queue_status_check;
alter table private.whatsapp_reminder_queue
  add constraint whatsapp_reminder_queue_status_check
  check (status = any (array['pending','processing','sent','failed','cancelled']::text[]));

create or replace function public.claim_whatsapp_reminders(p_limit integer default 25)
returns table (queue_id uuid, phone text, full_name text, due_date date, amount_cents integer, reminder_type text, attempt_number integer)
language plpgsql security definer set search_path = ''
as $$
begin
  if coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role' then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  return query
  with candidates as (
    select q.id from private.whatsapp_reminder_queue q
    join public.students s on s.id=q.student_id
    join public.subscriptions sub on sub.id=q.subscription_id
    where q.scheduled_for<=now()
      and (q.status in ('pending','failed') or (q.status='processing' and q.last_attempt_at<now()-interval '10 minutes'))
      and q.attempts<5 and s.status='active' and s.whatsapp_opt_in=true and s.phone is not null
      and sub.status in ('active','past_due')
      and not exists (
        select 1 from public.payments pay where pay.subscription_id=q.subscription_id
          and pay.status='paid' and pay.reference_month is not null
          and date_trunc('month',pay.reference_month::timestamp)=date_trunc('month',q.due_date::timestamp)
      )
    order by q.scheduled_for,q.created_at limit greatest(1,least(coalesce(p_limit,25),100))
    for update of q skip locked
  ), claimed as (
    update private.whatsapp_reminder_queue q set status='processing', attempts=q.attempts+1,
      last_attempt_at=now(), error_message=null
    from candidates c where q.id=c.id
    returning q.id,q.student_id,q.subscription_id,q.due_date,q.reminder_type,q.attempts
  )
  select c.id,s.phone,s.full_name,c.due_date,sub.monthly_amount_cents,c.reminder_type,c.attempts
  from claimed c join public.students s on s.id=c.student_id
  join public.subscriptions sub on sub.id=c.subscription_id;
end;
$$;

create or replace function public.complete_whatsapp_reminder(p_queue_id uuid,p_success boolean,p_provider_message_id text default null,p_error_message text default null)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role' then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  update private.whatsapp_reminder_queue
  set status=case when p_success then 'sent' else 'failed' end,
      provider_message_id=case when p_success then p_provider_message_id else null end,
      sent_at=case when p_success then now() else null end,
      error_message=case when p_success then null else left(coalesce(p_error_message,'Falha ao enviar'),1000) end
  where id=p_queue_id and status='processing';
end;
$$;

revoke all on function public.claim_whatsapp_reminders(integer) from public,anon,authenticated;
revoke all on function public.complete_whatsapp_reminder(uuid,boolean,text,text) from public,anon,authenticated;
grant execute on function public.claim_whatsapp_reminders(integer) to service_role;
grant execute on function public.complete_whatsapp_reminder(uuid,boolean,text,text) to service_role;

select cron.schedule('funcional-spartan-whatsapp-dispatch','*/5 * * * *',
  $job$
    select net.http_post(
      url := 'https://jdbpfrmjbwhtxrtcxjur.supabase.co/functions/v1/funcional-spartan-whatsapp-reminders',
      headers := jsonb_build_object('Content-Type','application/json','x-spartan-cron-secret',
        (select decrypted_secret from vault.decrypted_secrets where name='spartan_cron_secret' limit 1)),
      body := '{}'::jsonb, timeout_milliseconds := 20000
    )
    where exists (select 1 from vault.decrypted_secrets where name='spartan_cron_secret');
  $job$);
