import fs from 'fs';
import os from 'os';
import path from 'path';

import { getServerConfig, readServerConfig } from '../server-config';

describe('readServerConfig', () => {
  it('applies defaults', () => {
    expect(readServerConfig({})).toMatchObject({
      rpcUrls_1: [],
      clApiUrls_560048: [],
      rateLimit: 100,
      rateLimitTimeFrame: 60,
      validationAPI: undefined,
    });
  });

  it('parses env values', () => {
    expect(
      readServerConfig({
        EL_RPC_URLS_1: 'https://a.io/, https://b.io',
        RATE_LIMIT: '5',
        RATE_LIMIT_TIME_FRAME: '10',
      }),
    ).toMatchObject({
      rpcUrls_1: ['https://a.io', 'https://b.io'],
      rateLimit: 5,
      rateLimitTimeFrame: 10,
    });
  });
});

describe('readServerConfig devnetAddresses', () => {
  const tmpFile = path.join(os.tmpdir(), `devnet-${process.pid}.json`);
  afterAll(() => fs.rmSync(tmpFile, { force: true }));

  it('is null when path is unset', () => {
    expect(readServerConfig({}).devnetAddresses).toBeNull();
  });

  it('loads the json file', () => {
    fs.writeFileSync(tmpFile, JSON.stringify({ Accounting: '0xabc' }));
    expect(
      readServerConfig({ DEVNET_ADDRESSES_FILE_PATH: tmpFile }).devnetAddresses,
    ).toEqual({ Accounting: '0xabc' });
  });

  it('is null for a missing or invalid file', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    fs.writeFileSync(tmpFile, 'not json');
    expect(
      readServerConfig({ DEVNET_ADDRESSES_FILE_PATH: tmpFile }).devnetAddresses,
    ).toBeNull();
    expect(
      readServerConfig({ DEVNET_ADDRESSES_FILE_PATH: `${tmpFile}.nope` })
        .devnetAddresses,
    ).toBeNull();
    warn.mockRestore();
  });
});

describe('getServerConfig', () => {
  it('memoizes', () => {
    expect(getServerConfig()).toBe(getServerConfig());
  });
});
