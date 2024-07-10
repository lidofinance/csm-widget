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
import {
  ClaimBondFormDataContextValue,
  type ClaimBondFormInputType,
} from './types';

export const useClaimBondFormData = useFormData<ClaimBondFormDataContextValue>;

export const ClaimBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useClaimBondFormNetworkData();

  // TODO: default claimRewards=true only if rewards > 0
  const formObject = useForm<ClaimBondFormInputType>({
    defaultValues: {
      token: TOKENS.STETH,
      amount: null,
      claimRewards: true,
    },
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { claimBond } = useClaimBondSubmit({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<
    ClaimBondFormInputType,
    ClaimBondFormDataContextValue
  > = useMemo(
    () => ({
      onSubmit: claimBond,
      retryEvent,
    }),
    [claimBond, retryEvent],
  );

  return (
    <FormProvider {...formObject}>
      <FormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};
