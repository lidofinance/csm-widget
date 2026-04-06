import {
  type FormSubmitterHook,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { useTxModalStagesMetadata } from '../hooks/use-tx-modal-stages-metadata';
import type { MetadataFormInputType, MetadataFormNetworkData } from './types';
import { useMetadataFlowResolver } from './use-metadata-flow';

export const useMetadataSubmit: FormSubmitterHook<
  MetadataFormInputType,
  MetadataFormNetworkData
> = () => {
  const resolve = useMetadataFlowResolver();
  const { buildCallback } = useTxModalStagesMetadata();

  return useFlowSubmit(resolve, buildCallback);
};
