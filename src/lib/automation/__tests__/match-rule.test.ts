import { describe, expect, it } from 'vitest';
import { RuleSchema, matchesCondition, renderTemplate } from '@/lib/automation/schema';

describe('automation rule basics', () => {
  it('parses a valid rule and renders template', () => {
    const rule = RuleSchema.parse({
      name: 'Lead qualified -> task',
      trigger_type: 'field_changed',
      entity_type: 'lead',
      field_name: 'status',
      actions: [{ type: 'create_task', params: { title: 'Follow {{entity.name}}' } }],
    });

    expect(rule.name).toBe('Lead qualified -> task');
    expect(renderTemplate('Follow {{entity.name}}', { entity: { name: 'Ivan' } })).toBe('Follow Ivan');
  });

  it('matches a simple condition', () => {
    expect(matchesCondition({ op: 'eq', path: 'to', value: 'qualified' }, { to: 'qualified' })).toBe(true);
    expect(matchesCondition({ op: 'eq', path: 'to', value: 'qualified' }, { to: 'new' })).toBe(false);
  });
});
