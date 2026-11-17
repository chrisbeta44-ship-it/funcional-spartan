create or replace function public.claim_whatsapp_reminders(p_limit integer default 25)
returns table (queue_id uuid, phone text, full_name text, due_date date, amount_cents integer, reminder_type text, attempt_number integer)
language plpgsql security definer set search_path = ''
as $$
begin
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
  update private.whatsapp_reminder_queue
  set status=case when p_success then 'sent' else 'failed' end,
      provider_message_id=case when p_success then p_provider_message_id else null end,
      sent_at=case when p_success then now() else null end,
      error_message=case when p_success then null else left(coalesce(p_error_message,'Falha ao enviar'),1000) end
  where id=p_queue_id and status='processing';
end;
$$;

create or replace function public.verify_whatsapp_cron_secret(p_secret text)
returns boolean language sql security definer set search_path = ''
as $$
  select p_secret is not null
    and p_secret = (select decrypted_secret from vault.decrypted_secrets where name='spartan_cron_secret' limit 1);
$$;

revoke all on function public.claim_whatsapp_reminders(integer) from public, anon, authenticated;
revoke all on function public.complete_whatsapp_reminder(uuid,boolean,text,text) from public, anon, authenticated;
revoke all on function public.verify_whatsapp_cron_secret(text) from public, anon, authenticated;
grant execute on function public.claim_whatsapp_reminders(integer) to service_role;
grant execute on function public.complete_whatsapp_reminder(uuid,boolean,text,text) to service_role;
grant execute on function public.verify_whatsapp_cron_secret(text) to service_role;
