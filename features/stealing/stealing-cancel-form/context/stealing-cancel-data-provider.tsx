import {
  KEY_OPERATOR_BALANCE,
  useEthereumBalance,
  useOperatorsCount,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type StealingCancelFormNetworkData } from './types';

const useStealingCancelFormNetworkData: NetworkData<
  StealingCancelFormNetworkData
> = () => {
  const ethBalanceQuery = useEthereumBalance();

  const ethBalance = ethBalanceQuery.data;
  const isEthBalanceLoading = ethBalanceQuery.isPending;

  const { data: nodeOperatorsCount, isPending: isNodeOperatorsCountLoading } =
    useOperatorsCount();

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([ethBalanceQuery.queryKey, KEY_OPERATOR_BALANCE]);
  }, [invalidate, ethBalanceQuery.queryKey]);

  const isPending = isEthBalanceLoading || isNodeOperatorsCountLoading;

  return {
    data: {
      ethBalance,
      nodeOperatorsCount,
    } as StealingCancelFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useStealingCancelFormData =
  useFormData<StealingCancelFormNetworkData>;

export const StealingCancelDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useStealingCancelFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
