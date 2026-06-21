import { describe, it, expect } from 'vitest';
import { loadConfig, resolveBaseUrl } from './env';

describe('loadConfig', () => {
  it('usa defaults de dev (services)', () => {
    const c = loadConfig({});
    expect(c.upstreamMode).toBe('services');
    expect(c.donationsApiUrl).toBe('http://localhost:5003');
    expect(c.mockDonorCampaigns).toBe(false);
  });

  it('parseia flags booleanas de string', () => {
    const c = loadConfig({ MOCK_DONOR_CAMPAIGNS: 'true' });
    expect(c.mockDonorCampaigns).toBe(true);
  });

  it('interpreta a string "false" como false', () => {
    const c = loadConfig({ MOCK_DONOR_CAMPAIGNS: 'false' });
    expect(c.mockDonorCampaigns).toBe(false);
  });

  it('parseia MOCK_DONATIONS', () => {
    expect(loadConfig({ MOCK_DONATIONS: 'true' }).mockDonations).toBe(true);
    expect(loadConfig({}).mockDonations).toBe(false);
  });
});

describe('resolveBaseUrl', () => {
  it('em services roteia por grupo', () => {
    const c = loadConfig({});
    expect(resolveBaseUrl(c, 'users')).toBe('http://localhost:5001');
    expect(resolveBaseUrl(c, 'donations')).toBe('http://localhost:5003');
  });

  it('em apim usa a base única', () => {
    const c = loadConfig({ UPSTREAM_MODE: 'apim', APIM_BASE_URL: 'https://apim.example.com' });
    expect(resolveBaseUrl(c, 'users')).toBe('https://apim.example.com');
  });

  it('em apim sem APIM_BASE_URL lança erro', () => {
    const c = loadConfig({ UPSTREAM_MODE: 'apim' });
    expect(() => resolveBaseUrl(c, 'users')).toThrow();
  });
});
