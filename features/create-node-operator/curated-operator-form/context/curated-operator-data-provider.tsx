import {
  useSmStatus,
  useDappStatus,
  KEY_CURATED_GATES_PROOF,
  useEthereumBalance,
  useCuratedGatesEligibility,
} from 'modules/web3';
import { type FC, type PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  type NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type CuratedOperatorFormNetworkData } from './types';

const useCuratedOperatorFormNetworkData: NetworkData<
  CuratedOperatorFormNetworkData
> = () => {
  const { data: status, isPending: isStatusLoading } = useSmStatus();
  const { address } = useDappStatus();

  const ethBalanceQuery = useEthereumBalance();
  const ethBalance = ethBalanceQuery.data;
  const isEthBalanceLoading = ethBalanceQuery.isPending;

  const { data: availableGates, isPending: isGatesLoading } =
    useCuratedGatesEligibility(address);

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([['available-gates', address]]);

    invalidate([ethBalanceQuery.queryKey, KEY_CURATED_GATES_PROOF]);
  }, [address, ethBalanceQuery.queryKey, invalidate]);

  const isPending = isStatusLoading || isGatesLoading || isEthBalanceLoading;

  return {
    data: {
      ethBalance,
      address,
      availableGates,
      isPaused: status?.isPaused ?? false,
    } as CuratedOperatorFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useCuratedOperatorFormData =
  useFormData<CuratedOperatorFormNetworkData>;

export const CuratedOperatorDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useCuratedOperatorFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
