import {
  type FormSubmitterHook,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { useTxModalStagesRemoveKeys } from '../hooks/use-tx-modal-stages-remove-keys';
import { RemoveKeysFormInputType, RemoveKeysFormNetworkData } from './types';
import { useRemoveKeysFlowResolver } from './use-remove-keys-flow';

export const useRemoveKeysSubmit: FormSubmitterHook<
  RemoveKeysFormInputType,
  RemoveKeysFormNetworkData
> = () => {
  const resolve = useRemoveKeysFlowResolver();
  const { buildCallback } = useTxModalStagesRemoveKeys();

  return useFlowSubmit(resolve, buildCallback);
};
