import {
  KEY_CUSTOM_REWARDS_CLAIMER,
  useCustomRewardsClaimer,
  useNodeOperatorId,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useCanEditClaimer, useInvalidate } from 'shared/hooks';
import { zeroAddress } from 'viem';
import { type ClaimerFormNetworkData } from './types';

const useClaimerFormNetworkData: NetworkData<ClaimerFormNetworkData> = () => {
  const nodeOperatorId = useNodeOperatorId();
  const claimerQuery = useCustomRewardsClaimer(nodeOperatorId);
  const canEdit = useCanEditClaimer();

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
      canEdit,
    } as ClaimerFormNetworkData,
    isPending: claimerQuery.isPending,
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
