import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TOKENS } from 'consts/tokens';
import {
  FormControllerContext,
  FormControllerContextValueType,
  FormDataContext,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller';
import { useClaimBondFormNetworkData } from './use-claim-bond-form-network-data';
import { useClaimBondSubmit } from './use-claim-bond-submit';
import { ClaimBondFormNetworkData, type ClaimBondFormInputType } from './types';
import { useFormRevalidate } from './use-form-revalidate';
import { useClaimBondValidation } from './use-claim-bond-validation';

export const useClaimBondFormData = useFormData<ClaimBondFormNetworkData>;

export const ClaimBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const [networkData, revalidate] = useClaimBondFormNetworkData();
  const validationResolver = useClaimBondValidation(networkData);

  // TODO: default claimRewards=true only if rewards > 0
  const formObject = useForm<ClaimBondFormInputType>({
    defaultValues: {
      token: TOKENS.STETH,
      amount: undefined,
      claimRewards: true,
    },
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
