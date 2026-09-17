import { type Abi, toFunctionSelector } from 'viem';

// keccak per ABI item per request is ~1ms for a 100-function ABI; cache per ABI object.
const selectorCache = new WeakMap<Abi, Map<string, string>>();

const selectorsOf = (abi: Abi) => {
  let map = selectorCache.get(abi);
  if (!map) {
    map = new Map();
    for (const item of abi) {
      if (item.type === 'function')
        map.set(toFunctionSelector(item), item.name);
    }
    selectorCache.set(abi, map);
  }
  return map;
};

export const getFunctionNameFromAbi = (
  abi: Abi,
  methodEncoded: string,
): string | null => selectorsOf(abi).get(methodEncoded) ?? null;
