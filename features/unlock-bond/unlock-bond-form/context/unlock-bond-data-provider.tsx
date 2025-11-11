import {
  KEY_OPERATOR_BALANCE,
  useEthereumBalance,
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

  const balance = balanceQuery.data;
  const ethBalance = ethBalanceQuery.data;

  const isLockedBondLoading = balanceQuery.isPending;
  const isEthBalanceLoading = ethBalanceQuery.isPending;

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([ethBalanceQuery.queryKey, KEY_OPERATOR_BALANCE]);
  }, [invalidate, ethBalanceQuery.queryKey]);

  return {
    data: {
      nodeOperatorId,
      lockedBond: balance?.locked,
      ethBalance,
    } as UnlockBondFormNetworkData,
    isPending: isLockedBondLoading || isEthBalanceLoading,
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
