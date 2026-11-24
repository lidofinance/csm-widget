import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import {
  encodeDeployData,
  erc6492SignatureValidatorAbi,
  erc6492SignatureValidatorByteCode,
  zeroAddress,
} from 'viem';

import type { ValidationContext } from './types';
import {
  InvalidRequestError,
  SizeTooLargeError,
  UpstreamError,
} from './errors';
import {
  ethCallValidationFactory,
  ethGetLogsValidationFactory,
  maxSizeTransformFactory,
} from './validation';

const ALLOWED = '0xAbCdEf0000000000000000000000000000000001';
const chainId = 1;

const setup = (method: string) => {
  const inc = vi.fn();
  const validate = ethCallValidationFactory(
    { [chainId]: [ALLOWED.toLowerCase()] },
    method,
    { [chainId]: [ALLOWED.toLowerCase()] },
  );
  const run = (params: unknown[]) =>
    validate(
      { method, params },
      { chainId, rpcRequestBlocked: { inc } as any, requestRPC: vi.fn() },
    );
  return { run, inc };
};

const erc6492Data = encodeDeployData({
  abi: erc6492SignatureValidatorAbi,
  bytecode: erc6492SignatureValidatorByteCode,
  args: [zeroAddress, `0x${'11'.repeat(32)}`, '0x5678'],
});

describe.each(['eth_call', 'eth_estimateGas'])('%s validation', (method) => {
  it('passes allowlisted to', () => {
    const { run } = setup(method);
    expect(() => run([{ to: ALLOWED, data: '0x' }])).not.toThrow();
  });

  it('rejects non-allowlisted to', () => {
    const { run, inc } = setup(method);
    expect(() => run([{ to: zeroAddress, data: '0x' }])).toThrow(
      InvalidRequestError,
    );
    expect(() => run([{ to: zeroAddress, data: '0x' }])).toThrow(method);
    expect(inc).toHaveBeenCalled();
  });

  it('rejects missing to with arbitrary initcode', () => {
    const { run, inc } = setup(method);
    expect(() => run([{ data: '0x6080604052' }])).toThrow(InvalidRequestError);
    expect(inc).toHaveBeenCalled();
  });

  it('rejects null to with arbitrary initcode', () => {
    const { run } = setup(method);
    expect(() => run([{ to: null, data: '0x6080604052' }])).toThrow(
      InvalidRequestError,
    );
  });

  it('rejects missing to without data', () => {
    const { run } = setup(method);
    expect(() => run([{}])).toThrow(InvalidRequestError);
  });

  it('passes missing to with ERC-6492 validator deploy data', () => {
    const { run } = setup(method);
    expect(() => run([{ data: erc6492Data }])).not.toThrow();
    expect(() =>
      run([{ to: null, data: erc6492Data.toUpperCase().replace('0X', '0x') }]),
    ).not.toThrow();
  });

  it('rejects non-string to', () => {
    const { run } = setup(method);
    expect(() => run([{ to: 123, data: erc6492Data }])).toThrow(
      InvalidRequestError,
    );
    expect(() => run([{ to: [ALLOWED], data: '0x' }])).toThrow(
      InvalidRequestError,
    );
  });

  it('rejects malformed params', () => {
    const { run } = setup(method);
    expect(() => run([])).toThrow(InvalidRequestError);
    expect(() => run(['0x'])).toThrow(InvalidRequestError);
  });
});

describe('eth_call state override validation', () => {
  const slot = '0x' + '01'.repeat(32);

  it('rejects override address outside allowlist', () => {
    const { run, inc } = setup('eth_call');
    expect(() =>
      run([{ to: ALLOWED }, 'latest', { [zeroAddress]: { stateDiff: {} } }]),
    ).toThrow('State override address is not allowed for eth_call');
    expect(inc).toHaveBeenCalled();
  });

  it('passes allowlisted override address', () => {
    const { run } = setup('eth_call');
    expect(() =>
      run([
        { to: ALLOWED },
        'latest',
        { [ALLOWED.toLowerCase()]: { stateDiff: { [slot]: slot } } },
      ]),
    ).not.toThrow();
  });

  it('rejects non-string to', () => {
    const { run } = setup('eth_call');
    expect(() => run([{ to: 1 }])).toThrow('RPC method eth_call is invalid');
  });
});

describe('eth_getLogs validation', () => {
  const LOGS_ADDR = '0x' + '0a'.repeat(20);
  const rpcResult = (result: string) =>
    new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result }));

  const setupLogs = (opts: { allowed?: boolean; requestRPC?: any } = {}) => {
    const requestRPC: ValidationContext['requestRPC'] =
      opts.requestRPC ?? vi.fn(() => Promise.resolve(rpcResult('0x100')));
    const inc = vi.fn();
    const validate = ethGetLogsValidationFactory(
      opts.allowed === false ? undefined : { [chainId]: [LOGS_ADDR] },
      true,
      10,
      50,
    );
    const run = (filter: unknown) =>
      validate(
        { method: 'eth_getLogs', params: [filter] },
        { chainId, rpcRequestBlocked: { inc } as any, requestRPC },
      );
    return { run, requestRPC, inc };
  };

  it.each(['0X0', '0', ' 0x0', 'earliest', 'safe', 'finalized', undefined])(
    'rejects fromBlock %j',
    async (fromBlock) => {
      const { run } = setupLogs();
      await expect(run({ address: LOGS_ADDR, fromBlock })).rejects.toThrow(
        'RPC method eth_getLogs fromBlock is invalid',
      );
    },
  );

  it('rejects finalized fromBlock with latest toBlock', async () => {
    const { run } = setupLogs();
    await expect(
      run({ address: LOGS_ADDR, fromBlock: 'finalized', toBlock: 'latest' }),
    ).rejects.toThrow('fromBlock is invalid');
  });

  it('rejects invalid toBlock', async () => {
    const { run } = setupLogs();
    await expect(
      run({ address: LOGS_ADDR, fromBlock: '0x1', toBlock: 'earliest' }),
    ).rejects.toThrow('RPC method eth_getLogs toBlock is invalid');
  });

  it('rejects hex range over max and negative range', async () => {
    const { run } = setupLogs();
    await expect(
      run({ address: LOGS_ADDR, fromBlock: '0x0', toBlock: '0x20' }),
    ).rejects.toThrow('RPC method eth_getLogs range is invalid');
    await expect(
      run({ address: LOGS_ADDR, fromBlock: '0x20', toBlock: '0x0' }),
    ).rejects.toThrow('RPC method eth_getLogs range is invalid');
  });

  it('passes latest/latest without RPC', async () => {
    const { run, requestRPC } = setupLogs();
    await expect(
      run({ address: LOGS_ADDR, fromBlock: 'latest', toBlock: 'latest' }),
    ).resolves.toBeUndefined();
    expect(requestRPC).not.toHaveBeenCalled();
  });

  it('does not reject fromBlock above head with tag toBlock', async () => {
    const { run } = setupLogs();
    await expect(
      run({ address: LOGS_ADDR, fromBlock: '0x200' }),
    ).resolves.toBeUndefined();
  });

  it('rejects tag toBlock when head is too far from fromBlock', async () => {
    const { run } = setupLogs();
    await expect(run({ address: LOGS_ADDR, fromBlock: '0x1' })).rejects.toThrow(
      'RPC method eth_getLogs range is invalid',
    );
  });

  it('dedupes parallel cold-cache head lookups', async () => {
    const { run, requestRPC } = setupLogs();
    await Promise.all(
      Array.from({ length: 20 }, () =>
        run({ address: LOGS_ADDR, fromBlock: '0xf6' }),
      ),
    );
    expect(requestRPC).toHaveBeenCalledTimes(1);
  });

  it('does not cache a failed lookup', async () => {
    const requestRPC = vi
      .fn()
      .mockRejectedValueOnce(new Error('down'))
      .mockResolvedValue(rpcResult('0x100'));
    const { run } = setupLogs({ requestRPC });
    await expect(
      run({ address: LOGS_ADDR, fromBlock: '0xf6' }),
    ).rejects.toBeInstanceOf(UpstreamError);
    await expect(
      run({ address: LOGS_ADDR, fromBlock: '0xf6' }),
    ).resolves.toBeUndefined();
    expect(requestRPC).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['garbage result', () => rpcResult('garbage')],
    [
      'numeric result',
      () =>
        new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: 256 })),
    ],
    ['oversized body', () => new Response('x'.repeat(20_000))],
    ['non-ok status', () => new Response('{}', { status: 503 })],
  ])(
    'maps head lookup %s to upstream error and does not cache',
    async (_n, bad) => {
      const requestRPC = vi
        .fn()
        .mockResolvedValueOnce(bad())
        .mockResolvedValue(rpcResult('0x100'));
      const { run } = setupLogs({ requestRPC });
      await expect(
        run({ address: LOGS_ADDR, fromBlock: '0xf6' }),
      ).rejects.toBeInstanceOf(UpstreamError);
      await expect(
        run({ address: LOGS_ADDR, fromBlock: '0xf6' }),
      ).resolves.toBeUndefined();
      expect(requestRPC).toHaveBeenCalledTimes(2);
    },
  );

  it('rejects missing address', async () => {
    const { run } = setupLogs();
    await expect(run({ fromBlock: 'latest' })).rejects.toThrow(
      'RPC method eth_getLogs address is invalid',
    );
  });

  it('rejects foreign address without echoing it', async () => {
    const { run } = setupLogs();
    await expect(
      run({ address: zeroAddress, fromBlock: 'latest' }),
    ).rejects.toThrow(/^Address is not allowed for eth_getLogs$/);
  });

  it('rejects missing params', async () => {
    const { validate } = (() => {
      const validate = ethGetLogsValidationFactory(undefined, true, 10);
      return { validate };
    })();
    await expect(
      validate(
        { method: 'eth_getLogs' },
        {
          chainId,
          rpcRequestBlocked: { inc: vi.fn() } as any,
          requestRPC: vi.fn(),
        },
      ),
    ).rejects.toThrow('RPC method eth_getLogs is invalid');
  });
});

describe('maxSizeTransformFactory', () => {
  const collect = async (chunks: string[], max: number, onExceed = vi.fn()) => {
    const out: Buffer[] = [];
    await pipeline(
      Readable.from(chunks.map((c) => Buffer.from(c))),
      maxSizeTransformFactory(max, onExceed),
      async (source: AsyncIterable<Buffer>) => {
        for await (const chunk of source) out.push(chunk);
      },
    );
    return { out, onExceed };
  };

  it('passes data within the limit', async () => {
    const { out, onExceed } = await collect(['abc', 'de'], 5);
    expect(Buffer.concat(out).toString()).toBe('abcde');
    expect(onExceed).not.toHaveBeenCalled();
  });

  it('errors past the limit', async () => {
    const onExceed = vi.fn();
    await expect(collect(['abc', 'def'], 5, onExceed)).rejects.toBeInstanceOf(
      SizeTooLargeError,
    );
    expect(onExceed).toHaveBeenCalledTimes(1);
  });
});
