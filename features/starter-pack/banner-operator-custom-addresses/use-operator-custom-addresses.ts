import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useDappStatus } from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { useSessionStorage } from 'shared/hooks';
import { Address, isAddressEqual } from 'viem';

const EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const STORAGE_KEY = 'operator-custom-address';

type StoredValue = {
  nodeOperatorId: string; // serialized bigint
  address: Address;
  timestamp: number;
};

export const useOperatorCustomAddresses = () => {
  const { address: walletAddress } = useDappStatus();

  const [stored, setStored] = useSessionStorage<StoredValue | undefined>(
    STORAGE_KEY,
    undefined,
  );

  const nodeOperatorId = useMemo(() => {
    if (!stored?.nodeOperatorId) return undefined;
    if (!walletAddress || !isAddressEqual(stored.address, walletAddress))
      return undefined;
    if (Date.now() - stored.timestamp > EXPIRY_MS) return undefined;
    return BigInt(stored.nodeOperatorId);
  }, [stored, walletAddress]);

  const setOperatorCustomAddresses = useCallback(
    (id: NodeOperatorId | undefined) => {
      if (id === undefined || !walletAddress) {
        setStored(undefined);
      } else {
        setStored({
          nodeOperatorId: id.toString(),
          address: walletAddress,
          timestamp: Date.now(),
        });
      }
    },
    [walletAddress, setStored],
  );

  return [nodeOperatorId, setOperatorCustomAddresses] as const;
};
