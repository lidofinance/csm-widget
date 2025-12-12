import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { type RemoveKeysFormInputType } from './types';
import { useRemoveKeysSubmit } from './use-remove-keys-submit';
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

  const submitter = useRemoveKeysSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="removeKeys">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
