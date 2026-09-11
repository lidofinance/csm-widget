const CHAIN_ID = 1;
const KNOWN_ADDRESS = '0x1234567890123456789012345678901234567890';
const UNKNOWN_ADDRESS = '0xaBcDEF1234567890abcdEF1234567890AbCdEf12';
const REFERER = 'https://example.com/page';

jest.mock('../contractAddressesMetricsMap', () => ({
  METRIC_CONTRACT_ADDRESSES: {
    1: { '0x1234567890123456789012345678901234567890': 'csModule' },
  },
  getMetricContractAbi: jest.fn(() => []),
}));

jest.mock('../get-function-name-from-abi', () => ({
  getFunctionNameFromAbi: jest.fn(() => 'submit'),
}));

import { collectRequestAddressMetric } from '../collect-request-address-metric';
import { getMetricContractAbi } from '../contractAddressesMetricsMap';

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

const makeEthCall = (to: string) => ({
  method: 'eth_call',
  params: [{ to, data: '0x12345678' }],
});

const collect = (calls: any[], counter: any) =>
  collectRequestAddressMetric({
    calls,
    referer: REFERER,
    chainId: CHAIN_ID as any,
    metrics: counter,
  });

describe('collectRequestAddressMetric', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
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
      referer: REFERER,
      contractName: 'csModule',
      methodEncoded: '0x12345678',
      methodDecoded: 'submit',
    });
  });

  it('still records the call when ABI decoding throws', () => {
    const { counter, recorded } = makeCounterMock();
    (getMetricContractAbi as unknown as jest.Mock).mockImplementationOnce(
      () => {
        throw new Error('x'.repeat(64 * 1024));
      },
    );

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
});
