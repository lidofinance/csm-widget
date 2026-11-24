import { InvalidRequestError } from './errors';
import type { RpcRequest } from './types';

type PlainObject = Record<string, unknown>;

const SCALAR_RE = /^0x[0-9a-fA-F]{0,64}$/;
const BLOCK_TAG_RE =
  /^(latest|earliest|pending|safe|finalized|0x[0-9a-fA-F]{1,16})$/;
const BLOCK_NUMBER_RE = /^0x[0-9a-fA-F]{1,16}$/;
const HASH32_RE = /^0x[0-9a-fA-F]{64}$/;
// Override only plain token contracts: overriding a slot holding an address the contract calls would redirect calls and bypass the call allowlist
// ERC-1967 implementation, beacon, admin; Aragon kernel, appId
const PROXY_CONTROL_SLOTS = new Set([
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
  '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50',
  '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103',
  '0x4172f0f7d2289153072b0a6ca36959e0cbe2efc3afe50fc81636caa96338137b',
  '0xd625496217aa6a3453eecb9c3489dc5a53e6c67b444329ea2b2cbc9ff547639b',
]);

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

const CALL_KEYS_PASSTHROUGH = ['from', 'to', 'data'] as const;
const CALL_KEYS_SCALAR = [
  'value',
  'gas',
  'gasPrice',
  'maxFeePerGas',
  'maxPriorityFeePerGas',
  'nonce',
  'type',
  'chainId',
  'maxFeePerBlobGas',
] as const;
const CALL_KEYS_KNOWN = new Set<string>([
  ...CALL_KEYS_PASSTHROUGH,
  ...CALL_KEYS_SCALAR,
  'accessList',
]);

const MAX_ACCESS_LIST = 64;
const MAX_STORAGE_KEYS = 256;
const MAX_OVERRIDE_SLOTS = 64;
const MAX_LOGS_ADDRESSES = 64;
const MAX_TOPICS = 4;
const MAX_TOPIC_OR = 8;

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const has = (obj: object, key: string) => Object.hasOwn(obj, key);

export const readMethod = (raw: unknown): string => {
  if (!isPlainObject(raw)) throw new InvalidRequestError();
  const method = has(raw, 'method') ? raw.method : undefined;
  if (typeof method !== 'string') {
    throw new InvalidRequestError(`RPC method isn't string`);
  }
  return method;
};

export const canonicalizeEnvelope = (
  raw: unknown,
  method: string = readMethod(raw),
): RpcRequest => {
  if (!isPlainObject(raw)) throw new InvalidRequestError();

  const hasId = has(raw, 'id');
  const id = hasId ? raw.id : undefined;
  if (
    hasId &&
    id !== null &&
    typeof id !== 'number' &&
    typeof id !== 'string'
  ) {
    throw new InvalidRequestError();
  }

  const params = has(raw, 'params') ? raw.params : undefined;
  if (params !== undefined && !Array.isArray(params)) {
    throw new InvalidRequestError();
  }

  return {
    jsonrpc: '2.0',
    ...(hasId && { id: id as number | string | null }),
    method,
    ...(params !== undefined && { params: params as unknown[] }),
  };
};

const canonicalizeAccessList = (list: unknown, fail: () => never) => {
  if (!Array.isArray(list) || list.length > MAX_ACCESS_LIST) return fail();
  return list.map((item) => {
    if (
      !isPlainObject(item) ||
      typeof item.address !== 'string' ||
      !Array.isArray(item.storageKeys) ||
      item.storageKeys.length > MAX_STORAGE_KEYS ||
      item.storageKeys.some((key) => typeof key !== 'string')
    ) {
      return fail();
    }
    return { address: item.address, storageKeys: [...item.storageKeys] };
  });
};

const canonicalizeCallObject = (obj: unknown, fail: () => never) => {
  if (!isPlainObject(obj)) return fail();
  if (Object.keys(obj).some((key) => !CALL_KEYS_KNOWN.has(key))) return fail();
  const out: PlainObject = {};
  for (const key of CALL_KEYS_PASSTHROUGH) {
    if (has(obj, key)) out[key] = obj[key];
  }
  for (const key of CALL_KEYS_SCALAR) {
    if (!has(obj, key)) continue;
    const value = obj[key];
    if (typeof value !== 'string' || !SCALAR_RE.test(value)) return fail();
    out[key] = value;
  }
  if (has(obj, 'accessList')) {
    out.accessList = canonicalizeAccessList(obj.accessList, fail);
  }
  return out;
};

const canonicalizeBlockParam = (block: unknown, fail: () => never) => {
  if (typeof block === 'string') {
    return BLOCK_TAG_RE.test(block) ? block : fail();
  }
  if (!isPlainObject(block)) return fail();
  const keys = Object.keys(block);
  if (
    keys.some(
      (k) => !['blockHash', 'requireCanonical', 'blockNumber'].includes(k),
    )
  ) {
    return fail();
  }
  if (typeof block.blockHash !== 'string' || !HASH32_RE.test(block.blockHash)) {
    return fail();
  }
  const out: PlainObject = { blockHash: block.blockHash };
  if (has(block, 'requireCanonical')) {
    if (typeof block.requireCanonical !== 'boolean') return fail();
    out.requireCanonical = block.requireCanonical;
  }
  if (has(block, 'blockNumber')) {
    if (
      typeof block.blockNumber !== 'string' ||
      !BLOCK_NUMBER_RE.test(block.blockNumber)
    ) {
      return fail();
    }
    out.blockNumber = block.blockNumber;
  }
  return out;
};

const canonicalizeStateOverride = (override: unknown, fail: () => never) => {
  if (!isPlainObject(override)) return fail();
  let slots = 0;
  const out: PlainObject = {};
  for (const [address, account] of Object.entries(override)) {
    if (!ADDRESS_RE.test(address) || !isPlainObject(account)) return fail();
    if (Object.keys(account).some((k) => k !== 'state' && k !== 'stateDiff')) {
      return fail();
    }
    const rebuilt: PlainObject = {};
    for (const field of ['state', 'stateDiff'] as const) {
      if (!has(account, field)) continue;
      const storage = account[field];
      if (!isPlainObject(storage)) return fail();
      const slotsOut: Record<string, string> = {};
      for (const [slot, value] of Object.entries(storage)) {
        if (
          !HASH32_RE.test(slot) ||
          PROXY_CONTROL_SLOTS.has(slot.toLowerCase()) ||
          typeof value !== 'string' ||
          !HASH32_RE.test(value) ||
          ++slots > MAX_OVERRIDE_SLOTS
        ) {
          return fail();
        }
        slotsOut[slot] = value;
      }
      rebuilt[field] = slotsOut;
    }
    out[address] = rebuilt;
  }
  return out;
};

const canonicalizeCallParams = (
  req: RpcRequest,
  allowOverrides: boolean,
): RpcRequest => {
  const fail = (): never => {
    throw new InvalidRequestError(`RPC method ${req.method} is invalid`);
  };
  const params = req.params;
  if (!Array.isArray(params) || params.length === 0 || params.length > 3) {
    return fail();
  }

  const out: unknown[] = [canonicalizeCallObject(params[0], fail)];
  if (params.length >= 2) {
    out.push(canonicalizeBlockParam(params[1], fail));
  }
  if (params.length === 3 && params[2] != null) {
    if (!allowOverrides) return fail();
    out.push(canonicalizeStateOverride(params[2], fail));
  }
  return { ...req, params: out };
};

const isTopic = (t: unknown) =>
  t === null || (typeof t === 'string' && HASH32_RE.test(t));

const canonicalizeTopics = (topics: unknown, fail: () => never) => {
  if (!Array.isArray(topics) || topics.length > MAX_TOPICS) return fail();
  return topics.map((item) => {
    if (isTopic(item)) return item as string | null;
    if (
      Array.isArray(item) &&
      item.length <= MAX_TOPIC_OR &&
      item.every(isTopic)
    ) {
      return [...item] as (string | null)[];
    }
    return fail();
  });
};

const canonicalizeLogsParams = (req: RpcRequest): RpcRequest => {
  const fail = (): never => {
    throw new InvalidRequestError(`RPC method ${req.method} is invalid`);
  };
  const params = req.params;
  if (!Array.isArray(params) || params.length !== 1) return fail();
  const filter = params[0];
  if (!isPlainObject(filter)) return fail();

  const out: PlainObject = {};
  for (const key of ['address', 'fromBlock', 'toBlock', 'blockHash']) {
    if (has(filter, key)) out[key] = filter[key];
  }
  if (Array.isArray(out.address) && out.address.length > MAX_LOGS_ADDRESSES) {
    return fail();
  }
  if (has(filter, 'topics')) {
    out.topics = canonicalizeTopics(filter.topics, fail);
  }
  return { ...req, params: [out] };
};

export const canonicalizeParams = (
  req: RpcRequest,
  { allowOverrides }: { allowOverrides: boolean },
): RpcRequest => {
  switch (req.method) {
    case 'eth_call':
    case 'eth_estimateGas':
      return canonicalizeCallParams(req, allowOverrides);
    case 'eth_getLogs':
      return canonicalizeLogsParams(req);
    default:
      return req;
  }
};
