-- 2026-10-17: event outbox for automation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.event_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  actor_id UUID,
  correlation_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  attempts INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS event_outbox_entity_idx ON public.event_outbox (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS event_outbox_status_created_idx ON public.event_outbox (status, created_at);

ALTER TABLE public.event_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_outbox_insert" ON public.event_outbox
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "event_outbox_select_admin" ON public.event_outbox
  FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'director'));
