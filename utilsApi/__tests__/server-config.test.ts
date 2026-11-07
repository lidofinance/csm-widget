import { getServerConfig, readServerConfig } from '../server-config';

describe('readServerConfig', () => {
  it('applies defaults', () => {
    expect(readServerConfig({})).toMatchObject({
      maintenance: false,
      defaultChain: 560048,
      rpcUrls_1: [],
      clApiUrls_560048: [],
      cspReportOnly: false,
      rateLimit: 100,
      rateLimitTimeFrame: 60,
      validationAPI: undefined,
    });
  });

  it('parses env values', () => {
    expect(
      readServerConfig({
        MAINTENANCE: 'true',
        DEFAULT_CHAIN: '1',
        EL_RPC_URLS_1: 'https://a.io/, https://b.io',
        CSP_REPORT_ONLY: '1',
        RATE_LIMIT: '5',
        RATE_LIMIT_TIME_FRAME: '10',
      }),
    ).toMatchObject({
      maintenance: true,
      defaultChain: 1,
      rpcUrls_1: ['https://a.io', 'https://b.io'],
      cspReportOnly: true,
      rateLimit: 5,
      rateLimitTimeFrame: 10,
    });
  });
});

describe('getServerConfig', () => {
  it('memoizes', () => {
    expect(getServerConfig()).toBe(getServerConfig());
  });
});
