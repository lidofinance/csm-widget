import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TOKENS } from 'consts/tokens';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller';
import { useClaimBondFormNetworkData } from './use-claim-bond-form-network-data';
import { useClaimBond } from './use-claim-bond';
import { ClaimBondFormDataContext } from './claim-bond-form-context';
import { type ClaimBondFormInputType } from './types';

export const ClaimBondFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useClaimBondFormNetworkData();

  const formObject = useForm<ClaimBondFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      amount: null,
    },
    mode: 'onChange',
  });

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { claimBond } = useClaimBond({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<ClaimBondFormInputType> =
    useMemo(
      () => ({
        onSubmit: claimBond,
        retryEvent,
      }),
      [claimBond, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <ClaimBondFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </ClaimBondFormDataContext.Provider>
    </FormProvider>
  );
};
