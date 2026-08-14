const CHAIN_ID = 1;
const KNOWN_ADDRESS = '0x1234567890123456789012345678901234567890';
const UNKNOWN_ADDRESS = '0xaBcDEF1234567890abcdEF1234567890AbCdEf12';

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

describe('collectRequestAddressMetric', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('never logs an oversized `to` value, and keeps processing the batch', async () => {
    const { counter, recorded } = makeCounterMock();
    const oversizedTo = '0x' + 'a'.repeat(128 * 1024);

    await collectRequestAddressMetric({
      calls: [makeEthCall(oversizedTo), makeEthCall(UNKNOWN_ADDRESS)],
      referer: 'https://example.com/page',
      chainId: CHAIN_ID as any,
      metrics: counter as any,
    });

    expect(recorded).toHaveLength(1);
    for (const call of warnSpy.mock.calls) {
      const line = call.join(' ');
      expect(line.length).toBeLessThan(1024);
      expect(line).not.toContain('aaaaaaaaaa');
    }
  });

  it('bounds the logged text when a call throws', async () => {
    const { counter } = makeCounterMock();
    const malformedChecksum = '0x' + 'z'.repeat(40);

    await collectRequestAddressMetric({
      calls: [makeEthCall(malformedChecksum)],
      referer: 'https://example.com/page',
      chainId: CHAIN_ID as any,
      metrics: counter as any,
    });

    expect(warnSpy).toHaveBeenCalled();
    for (const call of warnSpy.mock.calls) {
      const line = call.join(' ');
      expect(line.length).toBeLessThan(512);
    }
  });

  it('records a well-formed call', async () => {
    const { counter, recorded } = makeCounterMock();

    await collectRequestAddressMetric({
      calls: [makeEthCall(KNOWN_ADDRESS)],
      referer: 'https://example.com/page',
      chainId: CHAIN_ID as any,
      metrics: counter as any,
    });

    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toMatchObject({
      address: KNOWN_ADDRESS,
      referer: 'https://example.com/page',
      contractName: 'csModule',
      methodEncoded: '0x12345678',
      methodDecoded: 'submit',
    });
  });

  it('still records the call when ABI decoding throws', async () => {
    const { counter, recorded } = makeCounterMock();
    (getMetricContractAbi as unknown as jest.Mock).mockImplementationOnce(
      () => {
        throw new Error('x'.repeat(64 * 1024));
      },
    );

    await collectRequestAddressMetric({
      calls: [makeEthCall(KNOWN_ADDRESS)],
      referer: 'https://example.com/page',
      chainId: CHAIN_ID as any,
      metrics: counter as any,
    });

    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toMatchObject({ methodDecoded: 'N/A' });
    for (const call of warnSpy.mock.calls) {
      const line = call.join(' ');
      expect(line.length).toBeLessThan(512);
      expect(line).toContain('…');
    }
  });

  // `slice(0, 10)` on an array returns 10 elements, so a bare length check lets
  // arbitrary content through into a label prom-client keeps forever.
  it('rejects a non-string `data` instead of labelling with it', async () => {
    const { counter, recorded } = makeCounterMock();

    await collectRequestAddressMetric({
      calls: [
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
      referer: 'https://example.com/page',
      chainId: CHAIN_ID as any,
      metrics: counter as any,
    });

    expect(recorded).toHaveLength(1);
    expect(recorded[0].methodEncoded).toBe('N/A');
    expect(JSON.stringify(recorded[0]).length).toBeLessThan(512);
  });

  it('continues past a malformed entry', async () => {
    const { counter, recorded } = makeCounterMock();

    await expect(
      collectRequestAddressMetric({
        calls: [{ method: 'eth_call' }, makeEthCall(KNOWN_ADDRESS)],
        referer: 'https://example.com/page',
        chainId: CHAIN_ID as any,
        metrics: counter as any,
      }),
    ).resolves.not.toThrow();

    expect(recorded).toHaveLength(1);
  });
});
