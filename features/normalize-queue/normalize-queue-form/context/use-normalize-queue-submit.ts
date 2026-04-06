import {
  type FormSubmitterHook,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { useTxModalStagesNormalizeQueue } from '../hooks/use-tx-modal-stages-normalize-queue';
import {
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData,
} from './types';
import { useNormalizeQueueFlowResolver } from './use-normalize-queue-flow';

export const useNormalizeQueueSubmit: FormSubmitterHook<
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData
> = () => {
  const resolve = useNormalizeQueueFlowResolver();
  const { buildCallback } = useTxModalStagesNormalizeQueue();

  return useFlowSubmit(resolve, buildCallback);
};
