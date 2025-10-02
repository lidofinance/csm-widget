import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
  useFormData,
} from 'shared/hook-form/form-controller';
import { ClaimTypeFormNetworkData, type ClaimTypeFormInputType } from './types';
import { useClaimTypeFormNetworkData } from './use-claim-type-form-network-data';
import { useClaimTypeSubmit } from './use-claim-type-submit';
import { useClaimTypeValidation } from './use-claim-type-validation';

export const useClaimTypeFormData = useFormData<ClaimTypeFormNetworkData>;

export const ClaimTypeFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useClaimTypeFormNetworkData();
  const validationResolver = useClaimTypeValidation(networkData);

  // TODO: validate (max amount)
  const formObject = useForm<ClaimTypeFormInputType>({
    defaultValues: {},
    resolver: validationResolver,
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { claimType } = useClaimTypeSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    ClaimTypeFormInputType,
    ClaimTypeFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: claimType,
      retryEvent,
    }),
    [claimType, retryEvent],
  );

  return (
    <FormProvider {...formObject}>
      <FormDataContext.Provider value={networkData}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};
