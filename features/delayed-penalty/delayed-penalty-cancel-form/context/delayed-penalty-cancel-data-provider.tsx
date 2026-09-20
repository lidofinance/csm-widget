import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
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
import { type DelayedPenaltyCancelFormNetworkData } from './types';

const useDelayedPenaltyCancelFormNetworkData: NetworkData<
  DelayedPenaltyCancelFormNetworkData,
  { module?: MODULE_NAME }
> = ({ module }) => {
  const ethBalanceQuery = useEthereumBalance();

  const ethBalance = ethBalanceQuery.data;
  const isEthBalanceLoading = ethBalanceQuery.isPending;

  const { data: nodeOperatorsCount, isPending: isNodeOperatorsCountLoading } =
    useOperatorsCount(module);

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([ethBalanceQuery.queryKey, KEY_OPERATORS_WITH_LOCKED_BOND]);
  }, [invalidate, ethBalanceQuery.queryKey]);

  const isPending = isEthBalanceLoading || isNodeOperatorsCountLoading;

  return {
    data: {
      ethBalance,
      nodeOperatorsCount,
    } as DelayedPenaltyCancelFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useDelayedPenaltyCancelFormData =
  useFormData<DelayedPenaltyCancelFormNetworkData>;

export const DelayedPenaltyCancelDataProvider: FC<
  PropsWithChildren<{ module?: MODULE_NAME }>
> = ({ children, module }) => {
  const networkData = useDelayedPenaltyCancelFormNetworkData({ module });

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
