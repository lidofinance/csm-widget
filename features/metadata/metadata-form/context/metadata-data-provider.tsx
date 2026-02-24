import {
  KEY_OPERATOR_METADATA,
  useNodeOperatorId,
  useOperatorMetadata,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormDataContext, useFormData } from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import type { MetadataFormNetworkData } from './types';

const useMetadataFormNetworkData = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: metadata, isPending } = useOperatorMetadata(nodeOperatorId);

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
    } as MetadataFormNetworkData,
    isPending,
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
