import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { type RemoveKeysFormInputType } from './types';
import { useRemoveKeysFlowResolver } from './use-remove-keys-flow';
import { useRemoveKeysValidation } from './use-remove-keys-validation';

export const RemoveKeysFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useRemoveKeysValidation();

  const defaultValues = useFormDefaultValues<RemoveKeysFormInputType>(() => ({
    selection: { start: 0, count: 0 },
  }));

  const formObject = useForm<RemoveKeysFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useFlowSubmit(useRemoveKeysFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="removeKeys">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
