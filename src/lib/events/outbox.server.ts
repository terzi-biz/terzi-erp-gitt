import type { SupabaseClient } from '@supabase/supabase-js';

export type EventOutboxRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  payload: Record<string, any>;
  actor_id?: string | null;
  correlation_id?: string | null;
  status: string;
};

export async function enqueueEvent(
  db: SupabaseClient,
  event: {
    entity_type: string;
    entity_id: string;
    action: string;
    payload?: Record<string, any>;
    actor_id?: string | null;
    correlation_id?: string | null;
  },
) {
  const { data, error } = await db
    .from('event_outbox')
    .insert({
      entity_type: event.entity_type,
      entity_id: event.entity_id,
      action: event.action,
      payload: event.payload ?? {},
      actor_id: event.actor_id ?? null,
      correlation_id: event.correlation_id ?? null,
      status: 'pending',
    })
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data as EventOutboxRow | null;
}

export async function claimPendingEvents(db: SupabaseClient, limit = 10): Promise<EventOutboxRow[]> {
  const { data, error } = await db
    .from('event_outbox')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const ids = data.map((row) => row.id);
  const { error: updateError } = await db
    .from('event_outbox')
    .update({
      status: 'running',
      attempts: data.map((row) => row.attempts + 1),
    })
    .in('id', ids as any[]);

  if (updateError) throw updateError;

  return data as EventOutboxRow[];
}

export async function markProcessed(db: SupabaseClient, id: string, ok = true) {
  const { error } = await db
    .from('event_outbox')
    .update({
      status: ok ? 'done' : 'failed',
      processed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}
