import {
  KEY_OPERATORS_WITH_LOCKED_BOND,
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
import { type DelayedPenaltyReportFormNetworkData } from './types';

const useDelayedPenaltyReportFormNetworkData: NetworkData<
  DelayedPenaltyReportFormNetworkData
> = () => {
  const ethBalanceQuery = useEthereumBalance();

  const ethBalance = ethBalanceQuery.data;
  const isEthBalanceLoading = ethBalanceQuery.isPending;

  const { data: nodeOperatorsCount, isPending: isNodeOperatorsCountLoading } =
    useOperatorsCount();

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([ethBalanceQuery.queryKey, KEY_OPERATORS_WITH_LOCKED_BOND]);
  }, [invalidate, ethBalanceQuery.queryKey]);

  return {
    data: {
      ethBalance,
      nodeOperatorsCount,
    } as DelayedPenaltyReportFormNetworkData,
    isPending: isEthBalanceLoading || isNodeOperatorsCountLoading,
    revalidate,
  };
};

export const useDelayedPenaltyReportFormData =
  useFormData<DelayedPenaltyReportFormNetworkData>;

export const DelayedPenaltyReportDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useDelayedPenaltyReportFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
