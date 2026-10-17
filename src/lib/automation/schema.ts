import { z } from 'zod';

export const ActionSchema = z.object({
  type: z.string(),
  params: z.record(z.any()).optional().default({}),
});

export const RuleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  enabled: z.boolean().optional().default(true),
  trigger_type: z.enum(['entity_created', 'entity_updated', 'entity_deleted', 'field_changed']),
  entity_type: z.string(),
  field_name: z.string().optional().nullable(),
  condition: z.any().optional().default({}),
  actions: z.array(ActionSchema).default([]),
  priority: z.number().int().optional().default(10),
});

export type Rule = z.infer<typeof RuleSchema>;
export type RuleAction = z.infer<typeof ActionSchema>;

export function getValueAtPath(obj: any, path: string): any {
  if (!path) return obj;
  const segments = path.split('.');
  let current = obj;
  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment];
  }
  return current;
}

export function matchesCondition(condition: any, payload: Record<string, any>): boolean {
  if (!condition || Object.keys(condition).length === 0) return true;
  const op = condition.op ?? 'eq';
  const path = condition.path;
  const actual = getValueAtPath(payload, path);
  const expected = condition.value;

  switch (op) {
    case 'eq': return actual === expected;
    case 'neq': return actual !== expected;
    case 'gt': return Number(actual) > Number(expected);
    case 'gte': return Number(actual) >= Number(expected);
    case 'lt': return Number(actual) < Number(expected);
    case 'lte': return Number(actual) <= Number(expected);
    case 'in': return Array.isArray(expected) ? expected.includes(actual) : false;
    case 'contains': return String(actual ?? '').includes(String(expected));
    default: return true;
  }
}

export function renderTemplate(template: string, context: Record<string, any>) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const value = getValueAtPath(context, key);
    return value == null ? '' : String(value);
  });
}
