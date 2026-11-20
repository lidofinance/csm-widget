import { keccak256, toHex } from 'viem';

import { InvalidRequestError } from './errors';
import {
  canonicalizeEnvelope,
  canonicalizeParams,
  readMethod,
} from './canonical-request';

const ADDR = '0x' + 'ab'.repeat(20);
const SLOT = '0x' + '01'.repeat(32);
const VAL = '0x' + '02'.repeat(32);

const call = (params: unknown[], allowOverrides = true, method = 'eth_call') =>
  canonicalizeParams({ method, params }, { allowOverrides });

describe('readMethod', () => {
  it('reads method without touching params', () => {
    expect(readMethod({ method: 'm', params: {} })).toBe('m');
  });

  it('rejects non-object and non-string method', () => {
    expect(() => readMethod(null)).toThrow(InvalidRequestError);
    expect(() => readMethod({ method: 1 })).toThrow("RPC method isn't string");
  });
});

describe('canonicalizeEnvelope', () => {
  it('does not forward case-variant or unknown keys', () => {
    const out = canonicalizeEnvelope({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_chainId',
      Method: 'debug_traceCall',
      METHOD: 'x',
      Params: [],
      ſ: 1,
      extra: 1,
    });
    expect(Object.keys(out)).toEqual(['jsonrpc', 'id', 'method']);
  });

  it.each([null, 1, 'x', true, [], undefined])('rejects item %j', (raw) => {
    expect(() => canonicalizeEnvelope(raw)).toThrow(InvalidRequestError);
  });

  it('rejects non-string method', () => {
    expect(() => canonicalizeEnvelope({ method: 1 })).toThrow(
      "RPC method isn't string",
    );
  });

  it.each([1, 'a', null])('preserves id %j', (id) => {
    expect(canonicalizeEnvelope({ id, method: 'm' }).id).toBe(id);
  });

  it('rejects invalid id', () => {
    expect(() => canonicalizeEnvelope({ id: {}, method: 'm' })).toThrow(
      InvalidRequestError,
    );
  });

  it('keeps absent id absent', () => {
    expect('id' in canonicalizeEnvelope({ method: 'm' })).toBe(false);
  });

  it('ignores prototype id', () => {
    const raw = Object.assign(Object.create({ id: 1 }), { method: 'm' });
    expect('id' in canonicalizeEnvelope(raw)).toBe(false);
  });

  it('keeps absent params absent', () => {
    expect('params' in canonicalizeEnvelope({ method: 'm' })).toBe(false);
  });

  it('rejects non-array params', () => {
    expect(() => canonicalizeEnvelope({ method: 'm', params: {} })).toThrow(
      InvalidRequestError,
    );
  });
});

describe('canonicalizeParams eth_call', () => {
  it('passes other methods unchanged', () => {
    const req = { method: 'eth_chainId' };
    expect(canonicalizeParams(req, { allowOverrides: true })).toBe(req);
  });

  it('rejects params length 4', () => {
    expect(() => call([{}, 'latest', null, 1])).toThrow(
      'RPC method eth_call is invalid',
    );
  });

  it('rejects empty and non-object params[0]', () => {
    expect(() => call([])).toThrow(InvalidRequestError);
    expect(() => call(['0x'])).toThrow(InvalidRequestError);
    expect(() => call([[]])).toThrow(InvalidRequestError);
  });

  it('drops input, To and unknown keys', () => {
    const out = call([
      { to: ADDR, data: '0x', input: '0x1', To: ADDR, foo: 1 },
    ]);
    expect(out.params).toEqual([{ to: ADDR, data: '0x' }]);
  });

  it('lets non-string to reach the validator', () => {
    expect(call([{ to: 1 }]).params).toEqual([{ to: 1 }]);
  });

  it('accepts eth_estimateGas with single param', () => {
    expect(call([{ to: ADDR }], true, 'eth_estimateGas').params).toEqual([
      { to: ADDR },
    ]);
  });

  it('rejects non-hex scalar', () => {
    expect(() => call([{ value: '12' }])).toThrow(InvalidRequestError);
    expect(() => call([{ value: 12 }])).toThrow(InvalidRequestError);
  });

  it('rebuilds accessList and rejects oversized', () => {
    const item = { address: ADDR, storageKeys: [SLOT], extra: 1 };
    expect(call([{ accessList: [item] }]).params).toEqual([
      { accessList: [{ address: ADDR, storageKeys: [SLOT] }] },
    ]);
    const big = Array.from({ length: 65 }, () => item);
    expect(() => call([{ accessList: big }])).toThrow(InvalidRequestError);
  });

  it.each(['latest', '0x10'])('accepts block %s', (block) => {
    expect(call([{}, block]).params).toEqual([{}, block]);
  });

  it('accepts block object', () => {
    const block = { blockHash: SLOT, requireCanonical: true };
    expect(call([{}, block]).params).toEqual([
      {},
      { blockHash: SLOT, requireCanonical: true },
    ]);
  });

  it('rejects garbage block tag and long hex', () => {
    expect(() => call([{}, 'garbage'])).toThrow(InvalidRequestError);
    expect(() => call([{}, '0x' + '1'.repeat(17)])).toThrow(
      InvalidRequestError,
    );
  });

  it('accepts stateDiff override only when allowed', () => {
    const override = { [ADDR]: { stateDiff: { [SLOT]: VAL } } };
    expect(call([{}, 'latest', override]).params).toEqual([
      {},
      'latest',
      override,
    ]);
    expect(() => call([{}, 'latest', override], false)).toThrow(
      InvalidRequestError,
    );
  });

  it('rejects override with code or bad shapes', () => {
    expect(() => call([{}, 'latest', { [ADDR]: { code: '0x00' } }])).toThrow(
      InvalidRequestError,
    );
    expect(() => call([{}, 'latest', { __proto__x: { state: {} } }])).toThrow(
      InvalidRequestError,
    );
    expect(() =>
      call([{}, 'latest', { [ADDR]: { state: { [SLOT]: '0x1' } } }]),
    ).toThrow(InvalidRequestError);
  });

  it('rejects overrides over 64 slots', () => {
    const slots = Object.fromEntries(
      Array.from({ length: 65 }, (_, i) => [
        '0x' + i.toString(16).padStart(64, '0'),
        VAL,
      ]),
    );
    expect(() => call([{}, 'latest', { [ADDR]: { state: slots } }])).toThrow(
      InvalidRequestError,
    );
  });

  it('drops null params[2]', () => {
    expect(call([{}, 'latest', null], false).params).toEqual([{}, 'latest']);
  });
});

describe('canonicalizeParams proxy-control slots', () => {
  const slots = {
    erc1967Impl: keccak256(toHex('eip1967.proxy.implementation')),
    aragonKernel: keccak256(toHex('aragonOS.appStorage.kernel')),
    aragonAppId: keccak256(toHex('aragonOS.appStorage.appId')),
    beacon:
      '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50',
    admin: '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103',
  };
  slots.erc1967Impl = toHex(BigInt(slots.erc1967Impl) - BigInt(1), {
    size: 32,
  });

  it.each(Object.entries(slots))('rejects %s slot', (_name, slot) => {
    for (const field of ['state', 'stateDiff']) {
      for (const key of [slot, slot.toUpperCase().replace('0X', '0x')]) {
        expect(() =>
          call([{}, 'latest', { [ADDR]: { [field]: { [key]: VAL } } }]),
        ).toThrow(InvalidRequestError);
      }
    }
  });
});

describe('canonicalizeParams eth_getLogs', () => {
  const logs = (params: unknown[]) => call(params, true, 'eth_getLogs');

  it('drops case-variant keys', () => {
    const out = logs([
      { address: ADDR, FromBlock: '0x0', fromBlock: '0x1', Address: ADDR },
    ]);
    expect(out.params).toEqual([{ address: ADDR, fromBlock: '0x1' }]);
  });

  it('rejects params length 2 and non-object', () => {
    expect(() => logs([{}, {}])).toThrow(InvalidRequestError);
    expect(() => logs(['x'])).toThrow(InvalidRequestError);
  });

  it('accepts valid topics', () => {
    const topics = [SLOT, null, [SLOT, null]];
    expect(logs([{ topics }]).params).toEqual([{ topics }]);
  });

  it.each([
    ['non-array', 'x'],
    ['non-32-byte', ['0x12']],
    ['more than 4', [SLOT, SLOT, SLOT, SLOT, SLOT]],
    ['OR over 8', [Array.from({ length: 9 }, () => SLOT)]],
  ])('rejects topics %s', (_name, topics) => {
    expect(() => logs([{ topics }])).toThrow(InvalidRequestError);
  });
});
