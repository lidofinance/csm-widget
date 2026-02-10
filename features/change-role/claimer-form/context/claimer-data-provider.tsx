import {
  KEY_CUSTOM_REWARDS_CLAIMER,
  useCustomRewardsClaimer,
  useDappStatus,
  useNodeOperatorId,
  useOperatorIsOwner,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { zeroAddress } from 'viem';
import { type ClaimerFormNetworkData } from './types';

const useClaimerFormNetworkData: NetworkData<ClaimerFormNetworkData> = () => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const claimerQuery = useCustomRewardsClaimer(nodeOperatorId);
  const { data: isOwner, isPending: isOwnerPending } = useOperatorIsOwner({
    address,
    nodeOperatorId,
  });

  const currentClaimerAddress =
    claimerQuery.data === zeroAddress ? undefined : claimerQuery.data;

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_CUSTOM_REWARDS_CLAIMER]);
  }, [invalidate]);

  return {
    data: {
      nodeOperatorId,
      currentClaimerAddress,
      isOwner: !!isOwner,
    } as ClaimerFormNetworkData,
    isPending: claimerQuery.isPending || isOwnerPending,
    revalidate,
  };
};

export const useClaimerFormData = useFormData<ClaimerFormNetworkData>;

export const ClaimerDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useClaimerFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
