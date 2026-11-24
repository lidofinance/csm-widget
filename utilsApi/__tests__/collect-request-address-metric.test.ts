import type { MockInstance } from 'vitest';
const CHAIN_ID = 1;
const KNOWN_ADDRESS = '0x1234567890123456789012345678901234567890';
const UNKNOWN_ADDRESS = '0xaBcDEF1234567890abcdEF1234567890AbCdEf12';

vi.mock('viem', async (importOriginal) => {
  const actual = await importOriginal<typeof import('viem')>();
  return { ...actual, isAddress: vi.fn(actual.isAddress) };
});

vi.mock('../contractAddressesMetricsMap', () => ({
  METRIC_CONTRACT_ADDRESSES: {
    1: { '0x1234567890123456789012345678901234567890': 'csModule' },
  },
  getMetricContractAbi: vi.fn(() => []),
}));

vi.mock('../get-function-name-from-abi', () => ({
  getFunctionNameFromAbi: vi.fn(() => 'submit'),
}));

import { isAddress } from 'viem';

import { collectRequestAddressMetric } from '../collect-request-address-metric';
import { getMetricContractAbi } from '../contractAddressesMetricsMap';
import { getFunctionNameFromAbi } from '../get-function-name-from-abi';

const makeCounterMock = () => {
  const recorded: Record<string, string>[] = [];
  const counter = {
    labels: (labels: Record<string, string>) => ({
      inc: () => {
        recorded.push(labels);
      },
    }),
  };
  return { counter, recorded };
};

const makeEthCall = (to: string, data = '0x12345678') => ({
  method: 'eth_call',
  params: [{ to, data }],
});

const collect = (calls: any[], counter: any) =>
  collectRequestAddressMetric({
    calls,
    chainId: CHAIN_ID as any,
    metrics: counter,
  });

describe('collectRequestAddressMetric', () => {
  it('never passes an oversized `to` to isAddress', () => {
    const { counter, recorded } = makeCounterMock();
    vi.mocked(isAddress).mockClear();
    collect([makeEthCall('0x' + 'a'.repeat(1024 * 1024))], counter);
    expect(isAddress).not.toHaveBeenCalled();
    expect(recorded).toHaveLength(0);
  });

  let warnSpy: MockInstance<typeof console.warn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  const warnLines = () => warnSpy.mock.calls.map((c) => c.join(' '));

  it('never logs an oversized `to` value, and keeps processing the batch', () => {
    const { counter, recorded } = makeCounterMock();
    const oversizedTo = '0x' + 'a'.repeat(128 * 1024);

    collect([makeEthCall(oversizedTo), makeEthCall(UNKNOWN_ADDRESS)], counter);

    expect(recorded).toHaveLength(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    for (const line of warnLines()) {
      expect(line.length).toBeLessThan(1024);
      expect(line).not.toContain('aaaaaaaaaa');
    }
  });

  it('records a well-formed call', () => {
    const { counter, recorded } = makeCounterMock();

    collect([makeEthCall(KNOWN_ADDRESS)], counter);

    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toMatchObject({
      address: KNOWN_ADDRESS,
      contractName: 'csModule',
      methodEncoded: '0x12345678',
      methodDecoded: 'submit',
    });
  });

  it('still records the call when ABI decoding throws', () => {
    const { counter, recorded } = makeCounterMock();
    vi.mocked(getMetricContractAbi).mockImplementationOnce(() => {
      throw new Error('x'.repeat(64 * 1024));
    });

    collect([makeEthCall(KNOWN_ADDRESS)], counter);

    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toMatchObject({ methodDecoded: 'N/A' });
    for (const line of warnLines()) {
      expect(line.length).toBeLessThan(512);
      expect(line).toContain('…');
    }
  });

  // `slice(0, 10)` on an array returns 10 elements, so a bare length check lets
  // arbitrary content through into a label prom-client keeps forever.
  it('rejects a non-string `data` instead of labelling with it', () => {
    const { counter, recorded } = makeCounterMock();

    collect(
      [
        {
          method: 'eth_call',
          params: [
            {
              to: KNOWN_ADDRESS,
              data: Array.from({ length: 10 }, () => 'z'.repeat(5000)),
            },
          ],
        },
      ],
      counter,
    );

    expect(recorded).toHaveLength(1);
    expect(recorded[0].methodEncoded).toBe('N/A');
    expect(JSON.stringify(recorded[0]).length).toBeLessThan(512);
  });

  it('continues past a malformed entry', () => {
    const { counter, recorded } = makeCounterMock();

    expect(() =>
      collect([{ method: 'eth_call' }, makeEthCall(KNOWN_ADDRESS)], counter),
    ).not.toThrow();

    expect(recorded).toHaveLength(1);
  });

  it('labels an unresolved contract address as N/A rather than the raw address', () => {
    const { counter, recorded } = makeCounterMock();

    collect([makeEthCall(UNKNOWN_ADDRESS)], counter);

    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toMatchObject({ address: 'N/A', contractName: 'N/A' });
  });

  it('labels a malformed selector as N/A and never leaks the raw value', () => {
    const { counter, recorded } = makeCounterMock();

    collect(
      [{ method: 'eth_call', params: [{ to: KNOWN_ADDRESS, data: '0xzz' }] }],
      counter,
    );

    expect(recorded).toHaveLength(1);
    expect(recorded[0].methodEncoded).toBe('N/A');
    expect(JSON.stringify(recorded[0])).not.toContain('zz');
  });

  it('counts malformed addresses once per batch and bounds the warn', () => {
    const { counter, recorded } = makeCounterMock();
    const malformedChecksum = '0x' + 'z'.repeat(40);

    collect(
      Array.from({ length: 5 }, () => makeEthCall(malformedChecksum)),
      counter,
    );

    expect(warnSpy).toHaveBeenCalledTimes(1);
    for (const line of warnLines()) {
      expect(line.length).toBeLessThan(512);
    }
    expect(recorded).toHaveLength(0);
  });

  it('labels an unknown selector on a known contract as N/A', () => {
    const { counter, recorded } = makeCounterMock();
    vi.mocked(getFunctionNameFromAbi).mockReturnValueOnce(undefined as any);

    collect([makeEthCall(KNOWN_ADDRESS, '0xdeadbeef')], counter);

    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toMatchObject({
      contractName: 'csModule',
      methodEncoded: 'N/A',
      methodDecoded: 'N/A',
    });
  });

  it('labels any selector on an unknown address as N/A', () => {
    const { counter, recorded } = makeCounterMock();

    collect([makeEthCall(UNKNOWN_ADDRESS, '0xdeadbeef')], counter);

    expect(recorded[0]).toMatchObject({
      methodEncoded: 'N/A',
      methodDecoded: 'N/A',
    });
  });

  it('keeps label cardinality bounded for unique selectors and addresses', () => {
    const { counter, recorded } = makeCounterMock();
    vi.mocked(getFunctionNameFromAbi).mockReturnValueOnce(undefined as any);

    const calls = Array.from({ length: 50 }, (_, i) =>
      makeEthCall(
        `0x${(i + 1).toString(16).padStart(40, '0')}`,
        `0x${i.toString(16).padStart(8, '0')}`,
      ),
    );
    collect([...calls, makeEthCall(KNOWN_ADDRESS, '0xdeadbeef')], counter);

    expect(new Set(recorded.map((l) => JSON.stringify(l))).size).toBe(2);
  });
});
