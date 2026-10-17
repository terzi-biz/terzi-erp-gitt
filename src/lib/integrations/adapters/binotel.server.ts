export function normalizeInboundBinotel(payload: any) {
  return {
    provider: 'binotel',
    provider_event_id: payload.call_id ?? payload.id ?? null,
    event_type: payload.event ?? 'call.completed',
    payload: {
      from: payload.from ?? null,
      to: payload.to ?? null,
      duration: payload.duration ?? null,
      result: payload.result ?? null,
      record_url: payload.record_url ?? null,
      raw: payload,
    },
  };
}

export async function testConnectionBinotel(config: any) {
  return { ok: Boolean(config?.token), message: config?.token ? 'ok' : 'missing token' };
}
