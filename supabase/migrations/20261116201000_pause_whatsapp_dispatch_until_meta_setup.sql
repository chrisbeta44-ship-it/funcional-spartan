-- Keep WhatsApp reminders paused until the Meta Cloud API credentials and approved template are configured.
select cron.unschedule('funcional-spartan-whatsapp-dispatch');
