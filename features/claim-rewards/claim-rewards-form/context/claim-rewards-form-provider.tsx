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
import { useClaimRewardsFormNetworkData } from './use-claim-rewards-form-network-data';
import { useClaimRewardsSubmit } from './use-claim-rewards-submit';
import {
  ClaimRewardsFormDataContextValue,
  type ClaimRewardsFormInputType,
} from './types';
import { useUpdateProof } from './use-update-proof';

export const useClaimRewardsFormData =
  useFormData<ClaimRewardsFormDataContextValue>;

export const ClaimRewardsFormProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useClaimRewardsFormNetworkData();

  const formObject = useForm<ClaimRewardsFormInputType>({
    defaultValues: {
      token: TOKENS.ETH,
      amount: null,
    },
    mode: 'onChange',
  });

  useUpdateProof(formObject, networkData);

  const { retryEvent, retryFire } = useFormControllerRetry();

  const { claimRewards } = useClaimRewardsSubmit({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<
    ClaimRewardsFormInputType,
    ClaimRewardsFormDataContextValue
  > = useMemo(
    () => ({
      onSubmit: claimRewards,
      retryEvent,
    }),
    [claimRewards, retryEvent],
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
