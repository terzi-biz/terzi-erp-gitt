export function normalizeInboundKeyCRM(payload: any) {
  return {
    provider: 'keycrm',
    provider_event_id: payload.id ?? payload.event_id ?? null,
    event_type: payload.type ?? 'lead.created',
    payload: {
      name: payload.data?.name ?? payload.name ?? 'Unknown',
      phone: payload.data?.phone ?? payload.phone ?? null,
      email: payload.data?.email ?? null,
      source: 'keycrm',
      raw: payload,
    },
  };
}

export async function testConnectionKeyCRM(config: any) {
  return { ok: Boolean(config?.apiKey), message: config?.apiKey ? 'ok' : 'missing api key' };
}
