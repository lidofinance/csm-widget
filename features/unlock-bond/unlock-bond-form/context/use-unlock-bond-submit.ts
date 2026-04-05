import {
  type FormSubmitterHook,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { useTxModalStagesUnlockBond } from '../hooks/use-tx-modal-stages-unlock-bond';
import { UnlockBondFormInputType, UnlockBondFormNetworkData } from './types';
import { useUnlockBondFlowResolver } from './use-unlock-bond-flow';

export const useUnlockBondSubmit: FormSubmitterHook<
  UnlockBondFormInputType,
  UnlockBondFormNetworkData
> = () => {
  const resolve = useUnlockBondFlowResolver();
  const { buildCallback } = useTxModalStagesUnlockBond();

  return useFlowSubmit(resolve, buildCallback);
};
