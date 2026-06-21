import { describe, it, expect, vi } from 'vitest';
import { HttpTransparencyGateway } from './http-transparency-gateway';
import { loadConfig } from '../config/env';

describe('HttpTransparencyGateway', () => {
  it('busca do upstream donations e mapeia', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ Id: '1', Title: 'A', Goal: 100, AmountRaised: 40, Percentual: 40 }]), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const gateway = new HttpTransparencyGateway(loadConfig({}), fetchImpl);
    const r = await gateway.listActiveCampaigns();
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value[0]?.id).toBe('1');
      expect(r.value[0]?.percentage).toBe(40);
    }
  });
});
