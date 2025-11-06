import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { StealingCancelUpdater } from './stealing-cancel-updater';
import { type StealingCancelFormInputType } from './types';
import { useStealingCancelSubmit } from './use-stealing-cancel-submit';
import { useStealingCancelValidation } from './use-stealing-cancel-validation';

export const StealingCancelFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const resolver = useStealingCancelValidation();

  const formObject = useForm<StealingCancelFormInputType>({
    defaultValues: {
      amount: undefined,
    },
    resolver,
    mode: 'onChange',
  });

  const submitter = useStealingCancelSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter}>
        <StealingCancelUpdater />
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
