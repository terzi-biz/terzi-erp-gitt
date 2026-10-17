-- 2026-10-17: automation rules and journal
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('entity_created', 'entity_updated', 'entity_deleted', 'field_changed')),
  entity_type TEXT NOT NULL,
  field_name TEXT,
  condition JSONB NOT NULL DEFAULT '{}'::jsonb,
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  priority INT NOT NULL DEFAULT 10,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.automation_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES public.automation_rules(id) ON DELETE CASCADE,
  run_id UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'success', 'failed')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB,
  error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS automation_rules_enabled_idx
  ON public.automation_rules (enabled, entity_type, trigger_type, priority);

CREATE INDEX IF NOT EXISTS automation_journal_rule_time_idx
  ON public.automation_journal (rule_id, started_at DESC);

ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "automation_rules_select" ON public.automation_rules
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "automation_journal_select" ON public.automation_journal
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "automation_rules_write" ON public.automation_rules
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'director'));

CREATE POLICY "automation_rules_update" ON public.automation_rules
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'director'));

CREATE POLICY "automation_rules_delete" ON public.automation_rules
  FOR DELETE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'director'));

CREATE POLICY "automation_journal_insert" ON public.automation_journal
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "automation_journal_update" ON public.automation_journal
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'director'));

CREATE OR REPLACE FUNCTION public.set_automation_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS automation_rules_updated_at ON public.automation_rules;
CREATE TRIGGER automation_rules_updated_at
  BEFORE UPDATE ON public.automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.set_automation_rules_updated_at();
