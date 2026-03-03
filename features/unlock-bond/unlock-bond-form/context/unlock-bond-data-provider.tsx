import {
  KEY_OPERATOR_BALANCE,
  KEY_IS_LOCK_EXPIRED,
  useEthereumBalance,
  useIsLockExpired,
  useNodeOperatorId,
  useOperatorBalance,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type UnlockBondFormNetworkData } from './types';

const useUnlockBondFormNetworkData: NetworkData<
  UnlockBondFormNetworkData
> = () => {
  const nodeOperatorId = useNodeOperatorId<true>();

  const balanceQuery = useOperatorBalance(nodeOperatorId);
  const ethBalanceQuery = useEthereumBalance();
  const isExpiredQuery = useIsLockExpired(nodeOperatorId);

  const balance = balanceQuery.data;
  const ethBalance = ethBalanceQuery.data;

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      ethBalanceQuery.queryKey,
      KEY_OPERATOR_BALANCE,
      KEY_IS_LOCK_EXPIRED,
    ]);
  }, [invalidate, ethBalanceQuery.queryKey]);

  return {
    data: {
      nodeOperatorId,
      lockedBond: balance?.locked,
      ethBalance,
      isExpired: !!isExpiredQuery.data,
    } as UnlockBondFormNetworkData,
    isPending:
      balanceQuery.isPending ||
      ethBalanceQuery.isPending ||
      isExpiredQuery.isPending,
    revalidate,
  };
};

export const useUnlockBondFormData = useFormData<UnlockBondFormNetworkData>;

export const UnlockBondDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useUnlockBondFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
