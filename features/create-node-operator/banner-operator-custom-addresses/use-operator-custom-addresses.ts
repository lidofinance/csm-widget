import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { OperatorRef, useDappStatus } from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { useSessionStorage } from 'shared/hooks';
import { Address, isAddressEqual } from 'viem';

const EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const STORAGE_KEY = 'operator-custom-address';

type StoredValue = {
  nodeOperatorId: string; // serialized bigint
  module?: MODULE_NAME;
  address: Address;
  timestamp: number;
};

export const useOperatorCustomAddresses = () => {
  const { address: walletAddress } = useDappStatus();

  const [stored, setStored] = useSessionStorage<StoredValue | undefined>(
    STORAGE_KEY,
    undefined,
  );

  const operator = useMemo((): OperatorRef | undefined => {
    if (!stored?.nodeOperatorId || !stored.module) return undefined;
    if (!walletAddress || !isAddressEqual(stored.address, walletAddress))
      return undefined;
    if (Date.now() - stored.timestamp > EXPIRY_MS) return undefined;
    return {
      nodeOperatorId: BigInt(stored.nodeOperatorId),
      module: stored.module,
    };
  }, [stored, walletAddress]);

  const setOperatorCustomAddresses = useCallback(
    (ref: OperatorRef | undefined) => {
      if (!ref || !walletAddress) {
        setStored(undefined);
      } else {
        setStored({
          nodeOperatorId: ref.nodeOperatorId.toString(),
          module: ref.module,
          address: walletAddress,
          timestamp: Date.now(),
        });
      }
    },
    [walletAddress, setStored],
  );

  return [operator, setOperatorCustomAddresses] as const;
};
