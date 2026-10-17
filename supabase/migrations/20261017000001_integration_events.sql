-- 2026-10-17: integration queue
CREATE TABLE IF NOT EXISTS public.integration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID,
  provider_key TEXT NOT NULL,
  provider_event_id TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  locked_at TIMESTAMPTZ,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS integration_events_status_idx ON public.integration_events (status, created_at);

ALTER TABLE public.integration_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "integration_events_select" ON public.integration_events
  FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'director'));

CREATE POLICY "integration_events_insert" ON public.integration_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
