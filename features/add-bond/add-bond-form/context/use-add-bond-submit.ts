import {
  type FormSubmitterHook,
  useFlowSubmit,
} from 'shared/hook-form/form-controller';
import { useTxModalStagesAddBond } from '../hooks/use-tx-modal-stages-add-bond';
import { AddBondFormInputType, AddBondFormNetworkData } from './types';
import { useAddBondFlowResolver } from './use-add-bond-flow';

export const useAddBondSubmit: FormSubmitterHook<
  AddBondFormInputType,
  AddBondFormNetworkData
> = () => {
  const resolve = useAddBondFlowResolver();
  const { buildCallback } = useTxModalStagesAddBond();

  return useFlowSubmit(resolve, buildCallback);
};
