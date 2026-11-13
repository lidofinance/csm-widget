const { standardFetcher, serverConfig } = vi.hoisted(() => ({
  standardFetcher: vi.fn(),
  serverConfig: {
    migalabsApiUrl: 'https://miga.example/api?foo=bar',
    migalabsApiToken: 'token',
  },
}));

vi.mock('utils', () => ({ standardFetcher }));
vi.mock('config', () => ({ config: { defaultChain: 1 } }));
vi.mock('../server-config', () => ({ getServerConfig: () => serverConfig }));
vi.mock('../external-metrics', () => ({
  responseTimeExternalMetricWrapper: ({
    request,
  }: {
    request: () => unknown;
  }) => request(),
}));
vi.mock('../getCurrentFrame', () => ({
  getCurrentFrame: async () => ({ numberEpochs: 100 }),
}));

import { getPerformance } from '../getPerformance';

describe('getPerformance', () => {
  test('builds the upstream URL via searchParams, keeping existing query', async () => {
    standardFetcher.mockResolvedValue({
      data: {
        operator_unified_performance: 1,
        network_unified_performance: 2,
      },
    });
    await getPerformance('42');
    const url = new URL(standardFetcher.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe('https://miga.example/api');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      foo: 'bar',
      operator_number: '42',
      number_epochs: '100',
      network: 'mainnet',
    });
  });
});
