import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormControllerRetry,
  useFormData,
} from 'shared/hook-form/form-controller';
import { ClaimBondFormNetworkData, type ClaimBondFormInputType } from './types';
import { useClaimBondFormNetworkData } from './use-claim-bond-form-network-data';
import { useClaimBondSubmit } from './use-claim-bond-submit';
import { useClaimBondValidation } from './use-claim-bond-validation';
import { useFormRevalidate } from './use-form-revalidate';
import { useGetDefaultValues } from './use-get-default-values';

export const useClaimBondFormData = useFormData<ClaimBondFormNetworkData>;

export const ClaimBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useClaimBondFormNetworkData();
  const validationResolver = useClaimBondValidation(networkData);

  const asyncDefaultValues = useGetDefaultValues(networkData);

  const formObject = useForm<ClaimBondFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver: validationResolver,
    mode: 'onChange',
  });

  useFormRevalidate(formObject);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { claimBond } = useClaimBondSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<
    ClaimBondFormInputType,
    ClaimBondFormNetworkData
  > = useMemo(
    () => ({
      onSubmit: claimBond,
      retryEvent,
    }),
    [claimBond, retryEvent],
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
