import type { SupabaseClient } from '@supabase/supabase-js';
import { RuleSchema } from './schema';

export async function createRule(db: SupabaseClient, input: any) {
  const parsed = RuleSchema.parse(input);
  const { data, error } = await db.from('automation_rules').insert(parsed).select('*').maybeSingle();
  if (error) throw error;
  return data;
}

export async function listRules(db: SupabaseClient) {
  const { data, error } = await db.from('automation_rules').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setRuleEnabled(db: SupabaseClient, id: string, enabled: boolean) {
  const { data, error } = await db.from('automation_rules').update({ enabled }).eq('id', id).select('*').maybeSingle();
  if (error) throw error;
  return data;
}

export async function listJournal(db: SupabaseClient, limit = 50) {
  const { data, error } = await db.from('automation_journal').select('*').order('started_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data ?? [];
}
