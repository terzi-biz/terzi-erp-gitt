import type { SupabaseClient } from '@supabase/supabase-js';
import { matchesCondition, renderTemplate, RuleSchema } from './schema';

export async function evaluateRules(db: SupabaseClient, event: any) {
  const { data: rules, error } = await db
    .from('automation_rules')
    .select('*')
    .eq('enabled', true)
    .eq('entity_type', event.entity_type)
    .order('priority', { ascending: true });

  if (error) throw error;
  if (!rules) return [];

  const matched = [] as any[];

  for (const row of rules) {
    try {
      const rule = RuleSchema.parse(row);
      const matchesType =
        rule.trigger_type === 'entity_created' ? event.action === 'created' :
        rule.trigger_type === 'entity_updated' ? event.action === 'updated' :
        rule.trigger_type === 'entity_deleted' ? event.action === 'deleted' :
        event.action === 'field_changed';

      const fieldMatches = !rule.field_name || !event.payload?.field || event.payload.field === rule.field_name;
      const conditionMatches = matchesCondition(rule.condition, event.payload ?? {});

      if (matchesType && fieldMatches && conditionMatches) {
        matched.push({ rule, raw: row });
      }
    } catch {
      // skip invalid rule definitions
    }
  }

  return matched;
}

export async function executeAction(db: SupabaseClient, event: any, action: any, rule: any) {
  if (action.type === 'create_task') {
    const titleTemplate = action.params?.title ?? 'Task for {{entity_id}}';
    const title = renderTemplate(titleTemplate, {
      entity_id: event.entity_id,
      entity: event.payload ?? {},
      payload: event.payload ?? {},
      event,
    });

    const { data, error } = await db
      .from('crm_tasks')
      .insert({
        title,
        kind: action.params?.kind ?? 'automated',
        created_by: event.actor_id ?? null,
      })
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return { task: data };
  }

  if (action.type === 'write_journal') {
    const note = renderTemplate(action.params?.note ?? 'Automation event', {
      entity_id: event.entity_id,
      payload: event.payload ?? {},
      event,
    });

    const { data, error } = await db
      .from('automation_journal')
      .insert({
        rule_id: rule.id,
        payload: event,
        status: 'success',
        result: { note },
      })
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return { journal: data };
  }

  return { ok: true, skipped: true, action: action.type };
}

export async function runAutomationForEvent(db: SupabaseClient, event: any) {
  const matches = await evaluateRules(db, event);
  const results: any[] = [];

  for (const item of matches) {
    const rule = item.rule;
    const runId = crypto.randomUUID();
    const initial = await db.from('automation_journal').insert({
      rule_id: item.raw.id,
      run_id: runId,
      status: 'running',
      payload: event,
      started_at: new Date().toISOString(),
    });
    if (initial.error) throw initial.error;

    for (const action of rule.actions) {
      try {
        const result = await executeAction(db, event, action, rule);
        results.push({ rule_id: item.raw.id, action: action.type, result });
      } catch (error: any) {
        await db.from('automation_journal').update({
          status: 'failed',
          error: String(error),
          finished_at: new Date().toISOString(),
        }).eq('run_id', runId);
        throw error;
      }
    }

    await db.from('automation_journal').update({
      status: 'success',
      result: { results },
      finished_at: new Date().toISOString(),
    }).eq('run_id', runId);
  }

  return results;
}
