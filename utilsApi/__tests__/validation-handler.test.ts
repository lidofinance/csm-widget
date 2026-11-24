import { isAddress } from 'viem';
import type { NextApiRequest, NextApiResponse } from 'next';

import { resolveAddressValidity } from 'utilsApi/address-validity';
import { validationHandler } from '../validation-handler';

vi.mock('viem', async (importOriginal) => {
  const actual = await importOriginal<typeof import('viem')>();
  return { ...actual, isAddress: vi.fn(actual.isAddress) };
});
vi.mock('utilsApi/client-request-headers', () => ({
  getClientRequestHeaders: () => ({}),
}));
vi.mock('utilsApi/address-validity', () => ({
  resolveAddressValidity: vi.fn(),
}));

const resolve = vi.mocked(resolveAddressValidity);
const ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

const run = async (address: string) => {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(),
  };
  await validationHandler(
    { query: { address } } as unknown as NextApiRequest,
    res as unknown as NextApiResponse,
  );
  return res;
};

describe('GET /api/validation handler', () => {
  beforeEach(() => resolve.mockReset());

  it('rejects malformed address with 400 without resolving', async () => {
    const res = await run('0x123');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(resolve).not.toHaveBeenCalled();
  });

  it('responds 429 when rate limited', async () => {
    resolve.mockResolvedValue({ status: 'rate-limited' });
    const res = await run(ADDRESS);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation service rate limit',
    });
  });

  it('responds 503 when validation is unavailable', async () => {
    resolve.mockResolvedValue({ status: 'unavailable' });
    const res = await run(ADDRESS);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Address validation unavailable',
    });
  });

  it.each([[false], [true]])('responds 200 isValid=%s', async (isValid) => {
    resolve.mockResolvedValue({ status: 'ok', isValid });
    const res = await run(ADDRESS);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ isValid });
  });

  it('passes the address lower-cased to the resolver', async () => {
    resolve.mockResolvedValue({ status: 'ok', isValid: true });
    await run(ADDRESS);
    expect(resolve).toHaveBeenCalledWith(ADDRESS.toLowerCase(), {});
  });

  it.each([
    ['43 chars', ADDRESS + '0'],
    ['1 MB', '0x' + 'a'.repeat(1 << 20)],
  ])('rejects %s address with 400 before isAddress', async (_name, address) => {
    vi.mocked(isAddress).mockClear();
    const res = await run(address);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(isAddress).not.toHaveBeenCalled();
    expect(resolve).not.toHaveBeenCalled();
  });

  it('rejects 42-char address with bad checksum', async () => {
    const bad = ADDRESS.slice(0, -1) + 'a';
    const res = await run(bad);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it.each([[ADDRESS], [ADDRESS.toLowerCase()]])(
    'accepts valid address %s',
    async (address) => {
      resolve.mockResolvedValue({ status: 'ok', isValid: true });
      const res = await run(address);
      expect(res.status).toHaveBeenCalledWith(200);
    },
  );
});
