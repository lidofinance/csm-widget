import {
  type FormSubmitterHook,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { useTxModalStagesEjectKeys } from '../hooks/use-tx-modal-stages-eject-keys';
import { EjectKeysFormInputType, EjectKeysFormNetworkData } from './types';
import { useEjectKeysFlowResolver } from './use-eject-keys-flow';

export const useEjectKeysSubmit: FormSubmitterHook<
  EjectKeysFormInputType,
  EjectKeysFormNetworkData
> = () => {
  const resolve = useEjectKeysFlowResolver();
  const { buildCallback } = useTxModalStagesEjectKeys();

  return useFlowSubmit(resolve, buildCallback);
};
