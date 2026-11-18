import {
  ethCallValidationFactory,
  ethGetLogsValidationFactory,
} from './validation';
import type { ValidationContext } from './types';

const ALLOWED = '0x' + 'ab'.repeat(20);
const OTHER = '0x' + 'cd'.repeat(20);

const makeContext = () => {
  const inc = vi.fn();
  const requestRPC = vi.fn();
  return {
    inc,
    requestRPC,
    context: {
      chainId: 1,
      rpcRequestBlocked: { inc },
      requestRPC,
    } as unknown as ValidationContext,
  };
};

describe('ethCallValidationFactory', () => {
  const validate = ethCallValidationFactory({ 1: [ALLOWED] });

  test('allows allowed address (case-insensitive)', () => {
    const { context } = makeContext();
    expect(() =>
      validate(
        { method: 'eth_call', params: [{ to: ALLOWED.toUpperCase() }] },
        context,
      ),
    ).not.toThrow();
  });

  test('allows deployless call without `to` but with `data`', () => {
    const { context } = makeContext();
    expect(() =>
      validate({ method: 'eth_call', params: [{ data: '0x1234' }] }, context),
    ).not.toThrow();
  });

  test('blocks non-allowed address', () => {
    const { context, inc } = makeContext();
    expect(() =>
      validate({ method: 'eth_call', params: [{ to: OTHER }] }, context),
    ).toThrow('not allowed for eth_call');
    expect(inc).toHaveBeenCalledWith({
      reason: 'address not allowed for eth_call',
    });
  });

  test('rejects call with neither `to` nor `data`', () => {
    const { context } = makeContext();
    expect(() =>
      validate({ method: 'eth_call', params: [{}] }, context),
    ).toThrow('eth_call is invalid');
  });
});

describe('ethGetLogsValidationFactory', () => {
  const validate = ethGetLogsValidationFactory(
    { 1: [ALLOWED] },
    true,
    1000,
    60_000,
  );
  const logs = (filter: Record<string, unknown>) => ({
    method: 'eth_getLogs',
    params: [{ address: ALLOWED, ...filter }],
  });

  test.each(['earliest', 'garbage', '0xzz', '', '1234'])(
    'rejects fromBlock %j',
    async (fromBlock) => {
      const { context } = makeContext();
      await expect(
        validate(logs({ fromBlock, toBlock: '0x10' }), context),
      ).rejects.toThrow('fromBlock is invalid');
    },
  );

  test('accepts hex range within limit', async () => {
    const { context } = makeContext();
    await expect(
      validate(logs({ fromBlock: '0x10', toBlock: '0x20' }), context),
    ).resolves.toBeUndefined();
  });

  test('rejects hex range over limit', async () => {
    const { context } = makeContext();
    await expect(
      validate(logs({ fromBlock: '0x1', toBlock: '0xffff' }), context),
    ).rejects.toThrow('range is invalid');
  });

  test('accepts near-head tag', async () => {
    const { context } = makeContext();
    await expect(
      validate(logs({ fromBlock: 'latest' }), context),
    ).resolves.toBeUndefined();
  });

  test('non-allowed address error has no TypeError message', async () => {
    const { context } = makeContext();
    await expect(
      validate(
        {
          method: 'eth_getLogs',
          params: [{ address: OTHER, fromBlock: '0x1' }],
        },
        context,
      ),
    ).rejects.toThrow('Address not allowed for eth_getLogs');
  });
});
