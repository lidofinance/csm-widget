import {
  KEY_OPERATOR_METADATA,
  useDappStatus,
  useNodeOperatorId,
  useOperatorIsOwner,
  useOperatorMetadata,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormDataContext, useFormData } from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import type { MetadataFormNetworkData } from './types';

const useMetadataFormNetworkData = () => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: metadata, isPending } = useOperatorMetadata(nodeOperatorId);
  const { data: isOwner, isPending: isOwnerPending } = useOperatorIsOwner({
    address,
    nodeOperatorId,
  });

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_OPERATOR_METADATA]);
  }, [invalidate]);

  return {
    data: {
      nodeOperatorId,
      currentName: metadata?.name,
      currentDescription: metadata?.description,
      ownerEditsRestricted: metadata?.ownerEditsRestricted,
      isOwner,
    } as MetadataFormNetworkData,
    isPending: isPending || isOwnerPending,
    revalidate,
  };
};

export const useMetadataFormData = useFormData<MetadataFormNetworkData>;

export const MetadataDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useMetadataFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
