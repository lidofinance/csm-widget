import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import {
  encodeDeployData,
  erc6492SignatureValidatorAbi,
  erc6492SignatureValidatorByteCode,
  zeroAddress,
} from 'viem';

import { InvalidRequestError, SizeTooLargeError } from './errors';
import {
  ethCallValidationFactory,
  maxSizeTransformFactory,
} from './validation';

const ALLOWED = '0xAbCdEf0000000000000000000000000000000001';
const chainId = 1;

const setup = (method: string) => {
  const inc = vi.fn();
  const validate = ethCallValidationFactory(
    { [chainId]: [ALLOWED.toLowerCase()] },
    method,
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
