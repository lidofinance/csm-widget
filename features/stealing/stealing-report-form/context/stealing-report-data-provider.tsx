import { useEthereumBalance, useOperatorsCount } from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type StealingReportFormNetworkData } from './types';

const useStealingReportFormNetworkData: NetworkData<
  StealingReportFormNetworkData
> = () => {
  const ethBalanceQuery = useEthereumBalance();

  const ethBalance = ethBalanceQuery.data;
  const isEthBalanceLoading = ethBalanceQuery.isPending;

  const { data: nodeOperatorsCount, isPending: isNodeOperatorsCountLoading } =
    useOperatorsCount();

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([ethBalanceQuery.queryKey]);
  }, [invalidate, ethBalanceQuery.queryKey]);

  return {
    data: {
      ethBalance,
      nodeOperatorsCount,
    } as StealingReportFormNetworkData,
    isPending: isEthBalanceLoading || isNodeOperatorsCountLoading,
    revalidate,
  };
};

export const useStealingReportFormData =
  useFormData<StealingReportFormNetworkData>;

export const StealingReportDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useStealingReportFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
