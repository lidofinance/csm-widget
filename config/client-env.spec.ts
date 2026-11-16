import { buildClientEnv, serializeClientEnv } from './client-env.mjs';

describe('buildClientEnv', () => {
  it('falls back to defaults on an empty env', () => {
    expect(buildClientEnv({})).toEqual({
      matomoHost: undefined,
      defaultChain: 560048,
      walletconnectProjectId: undefined,
      isTestEnv: true,
      maintenance: false,
      addressValidationEnabled: false,
      keysApiUrl: undefined,
      feesMonitoringApiUrl: undefined,
      surveysApiUrl: undefined,
      ipfsGateways: [],
      devnetAddresses: null,
    });
  });

  it('parses env values', () => {
    const env = buildClientEnv({
      DEFAULT_CHAIN: '1',
      IS_PROD: 'true',
      MAINTENANCE: '1',
      VALIDATION_SERVICE_BASE_PATH: 'https://validation',
      IPFS_GATEWAYS: ' https://a.io/ , https://b.io//,',
    });
    expect(env).toMatchObject({
      defaultChain: 1,
      isTestEnv: false,
      maintenance: true,
      addressValidationEnabled: true,
      ipfsGateways: ['https://a.io', 'https://b.io'],
    });
  });

  it('passes devnet addresses through', () => {
    const devnetAddresses = { CSModule: '0x01' };
    expect(buildClientEnv({}, { devnetAddresses }).devnetAddresses).toBe(
      devnetAddresses,
    );
  });

  it('does not expose server secrets', () => {
    const env = buildClientEnv({ EL_RPC_URLS_1: 'https://secret' });
    expect(JSON.stringify(env)).not.toContain('secret');
  });

  it.each([
    [{ VALIDATION_SERVICE_BASE_PATH: 'https://validation' }, true],
    [{ VALIDATION_FILE_PATH: '/run/deny.json' }, true],
    [{}, false],
  ])('addressValidationEnabled for %o is %s', (env, expected) => {
    expect(buildClientEnv(env).addressValidationEnabled).toBe(expected);
  });

  it('does not expose the deny-list path', () => {
    const env = buildClientEnv({ VALIDATION_FILE_PATH: '/run/deny.json' });
    expect(JSON.stringify(env)).not.toContain('deny.json');
  });
});

describe('serializeClientEnv', () => {
  it('escapes script-breaking characters and round-trips', () => {
    const env = {
      ...buildClientEnv({}),
      matomoHost: '</script><b>&\u2028\u2029',
    };
    const out = serializeClientEnv(env);
    expect(out).not.toMatch(/[<>&\u2028\u2029]/);
    expect(JSON.parse(out)).toEqual(JSON.parse(JSON.stringify(env)));
  });
});
