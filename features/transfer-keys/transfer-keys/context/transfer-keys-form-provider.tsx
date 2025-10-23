import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormControllerProvider } from 'shared/hook-form/form-controller';
import { type TransferKeysFormInputType } from './types';
import { useTransferKeysSubmit } from './use-transfer-keys-submit';

export const TransferKeysFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const formObject = useForm<TransferKeysFormInputType>({
    mode: 'onChange',
  });

  const submitter = useTransferKeysSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter}>
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
