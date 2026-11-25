import {
  KEY_OPERATOR_METADATA,
  useModule,
  useNodeOperatorId,
  useOperatorIsOwner,
  useOperatorMetadata,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormDataContext, useFormData } from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import type { MetadataFormNetworkData } from './types';

const useMetadataFormNetworkData = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { module } = useModule();
  const { data: metadata, isPending } = useOperatorMetadata({
    nodeOperatorId,
    module,
  });
  const { data: isOwner, isPending: isOwnerPending } = useOperatorIsOwner({
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
