import {
  KEY_OPERATOR_BALANCE,
  KEY_STAKE_LIMIT,
  useCsmStatus,
  useEthereumBalance,
  useNodeOperatorId,
  useOperatorBalance,
  useStakeLimit,
  useStethBalance,
  useWstethBalance,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type AddBondFormNetworkData } from './types';

const useAddBondFormNetworkData: NetworkData<AddBondFormNetworkData> = () => {
  const nodeOperatorId = useNodeOperatorId();

  const ethBalanceQuery = useEthereumBalance();
  const stethBalanceQuery = useStethBalance();
  const wstethBalanceQuery = useWstethBalance();
  const bondQuery = useOperatorBalance(nodeOperatorId);
  const maxStakeEthQuery = useStakeLimit();

  const ethBalance = ethBalanceQuery.data;
  const stethBalance = stethBalanceQuery.data;
  const wstethBalance = wstethBalanceQuery.data;
  const bond = bondQuery.data;
  const maxStakeEth = maxStakeEthQuery.data;

  const isEthBalanceLoading = ethBalanceQuery.isPending;
  const isStethBalanceLoading = stethBalanceQuery.isPending;
  const isWstethBalanceLoading = wstethBalanceQuery.isPending;
  const isBondLoading = bondQuery.isPending;
  const isMaxStakeEthLoading = maxStakeEthQuery.isPending;

  const { data: status, isPending: isStatusLoading } = useCsmStatus();

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      ethBalanceQuery.queryKey,
      stethBalanceQuery.queryKey,
      wstethBalanceQuery.queryKey,
      KEY_OPERATOR_BALANCE,
      KEY_STAKE_LIMIT,
    ]);
  }, [
    invalidate,
    ethBalanceQuery.queryKey,
    stethBalanceQuery.queryKey,
    wstethBalanceQuery.queryKey,
  ]);

  const isPending =
    isEthBalanceLoading ||
    isStethBalanceLoading ||
    isWstethBalanceLoading ||
    isBondLoading ||
    isMaxStakeEthLoading ||
    isStatusLoading;

  return {
    data: {
      nodeOperatorId,
      ethBalance,
      stethBalance,
      wstethBalance,
      bond,
      maxStakeEth,
      isPaused: status?.isPausedAccounting,
    } as AddBondFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useAddBondFormData = useFormData<AddBondFormNetworkData>;

export const AddBondDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useAddBondFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
