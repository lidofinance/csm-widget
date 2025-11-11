import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { type NormalizeQueueFormInputType } from './types';
import { useNormalizeQueueSubmit } from './use-normalize-queue-submit';
import { useNormalizeQueueValidation } from './use-normalize-queue-validation';

export const NormalizeQueueFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const resolver = useNormalizeQueueValidation();

  const formObject = useForm<NormalizeQueueFormInputType>({
    resolver,
    mode: 'onChange',
  });

  const submitter = useNormalizeQueueSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter}>
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
