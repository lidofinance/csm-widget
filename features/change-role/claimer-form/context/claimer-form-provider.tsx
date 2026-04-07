import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { useTxModalStagesClaimer } from '../hooks/use-tx-modal-stages-claimer';
import { ClaimerFormNetworkData, type ClaimerFormInputType } from './types';
import { useClaimerFlowResolver } from './use-claimer-flow';
import { useClaimerValidation } from './use-claimer-validation';

export const ClaimerFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useClaimerValidation();

  const defaultValues = useFormDefaultValues<
    ClaimerFormInputType,
    ClaimerFormNetworkData
  >(() => ({
    isUnset: false,
    address: undefined,
  }));

  const formObject = useForm<ClaimerFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const resolve = useClaimerFlowResolver();
  const { buildCallback } = useTxModalStagesClaimer();
  const submitter = useFlowSubmit(resolve, buildCallback);

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="claimer">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
