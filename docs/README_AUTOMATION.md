# Automation scaffolding for TERZI ERP

This document describes the initial automation foundation for the ERP Control Center without Lovable credits or project tokens.

## What is implemented in this stage

- Event outbox: `event_outbox`
- Integration queue: `integration_events`
- Audit log: `audit_log`
- Automation rules: `automation_rules`
- Automation journal: `automation_journal`
- Basic runner skeleton: `src/lib/automation/runner.server.ts`
- Basic adapter stubs: `src/lib/integrations/adapters/keycrm.server.ts`, `binotel.server.ts`
- Basic UI PoC: `src/components/automation/RulesEditor.tsx`, `JournalPanel.tsx`, route `src/routes/settings.control-center.tsx`

## Notes

- The initial stage is intentionally lightweight and mock-based.
- The real production workflow should use Supabase Realtime for live page syncing and server-side event processing.
- Keys and production secrets should never be committed to the repository.

## Recommended flow: lead → task

1. lead status changes in DB
2. server inserts event into event_outbox
3. runner reads pending events
4. rule engine evaluates `field_changed` conditions
5. action creates a CRM task
6. task appears in task list and dashboard immediately via Realtime or refresh invalidation
