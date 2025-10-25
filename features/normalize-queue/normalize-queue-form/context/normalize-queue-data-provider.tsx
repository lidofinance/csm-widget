import {
  KEY_OPERATOR_INFO,
  useEthereumBalance,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type NormalizeQueueFormNetworkData } from './types';

const useNormalizeQueueFormNetworkData: NetworkData<
  NormalizeQueueFormNetworkData
> = () => {
  const nodeOperatorId = useNodeOperatorId();

  const infoQuery = useOperatorInfo(nodeOperatorId);
  const ethBalanceQuery = useEthereumBalance();

  const info = infoQuery.data;
  const ethBalance = ethBalanceQuery.data;

  const isInfoLoading = infoQuery.isPending;
  const isEthBalanceLoading = ethBalanceQuery.isPending;

  const unqueuedCount = info
    ? info.depositableValidatorsCount - info.enqueuedCount
    : undefined;

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_OPERATOR_INFO, ethBalanceQuery.queryKey]);
  }, [invalidate, ethBalanceQuery.queryKey]);

  const isPending = isInfoLoading || isEthBalanceLoading;

  return {
    data: {
      nodeOperatorId,
      info,
      unqueuedCount,
      ethBalance,
    } as NormalizeQueueFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useNormalizeQueueFormData =
  useFormData<NormalizeQueueFormNetworkData>;

export const NormalizeQueueDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useNormalizeQueueFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
