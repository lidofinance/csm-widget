import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { getFromLocalStorage, saveToLocalStorage } from '../localStorage';

const KEY_TTL_IN_BLOCKS = 93_000; // ~ 2 weeks: 60 * 60 * 24 * 7 * 2 / 13

type KeysRecord = Record<string, number>; // pubkey, blockNumber

const getStorageKey = (chainId: CSM_SUPPORTED_CHAINS) =>
  `lido-csm-keys-${chainId}`;

const setKeys = (chainId: CSM_SUPPORTED_CHAINS, keys: KeysRecord) =>
  saveToLocalStorage(getStorageKey(chainId), keys);

const getKeys = (chainId: CSM_SUPPORTED_CHAINS): KeysRecord =>
  getFromLocalStorage(getStorageKey(chainId)) || {};

const getIsKeyToKeep = (keyBlock: number, currentBlock?: number) => {
  if (!keyBlock || !currentBlock) return true;
  const age = Math.max(currentBlock - keyBlock, 0);
  const isOld = age >= KEY_TTL_IN_BLOCKS;
  return !isOld;
};

const cleanKeys = (keys: KeysRecord, blockNumber: number): KeysRecord => {
  return Object.entries(keys).reduce(
    (updatedKeys, [pubKey, keyBlockNumber]) => {
      const keepKey = getIsKeyToKeep(keyBlockNumber, blockNumber);

      if (keepKey) {
        updatedKeys[pubKey] = keyBlockNumber;
      }

      return updatedKeys;
    },
    {} as KeysRecord,
  );
};

export const saveKeys = (
  pubKeys: string[],
  chainId: CSM_SUPPORTED_CHAINS,
  blockNumber: number,
): void => {
  const storedKeys = getKeys(chainId);

  const updatedKeys = pubKeys.reduce(
    (mergedKeys, pubKey) => {
      mergedKeys[pubKey] = blockNumber;
      return mergedKeys;
    },
    cleanKeys(storedKeys, blockNumber),
  );

  setKeys(chainId, updatedKeys);
};

export const removeKeys = (
  pubKeys: string[],
  chainId: CSM_SUPPORTED_CHAINS,
  blockNumber: number,
) => {
  const storedKeys = getKeys(chainId);

  const updatedKeys = pubKeys.reduce(
    (mergedKeys, pubKey) => {
      delete mergedKeys[pubKey];
      return mergedKeys;
    },
    cleanKeys(storedKeys, blockNumber),
  );

  setKeys(chainId, updatedKeys);
};

export const checkKeys = (
  pubKeys: string[],
  chainId: CSM_SUPPORTED_CHAINS,
  blockNumber?: number,
) => {
  const storedKeys = getKeys(chainId);

  return pubKeys.filter((pubKey) => {
    const keyBlockNumber = storedKeys[pubKey];
    return keyBlockNumber ? getIsKeyToKeep(keyBlockNumber, blockNumber) : false;
  });
};
