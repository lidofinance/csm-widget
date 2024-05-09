import { FC, PropsWithChildren, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TOKENS } from 'consts/tokens';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller';
import { useClaimRewardsFormNetworkData } from './use-claim-rewards-form-network-data';
import { useClaimRewards } from './use-claim-rewards';
import { ClaimRewardsFormDataContext } from './claim-rewards-form-context';
import { type ClaimRewardsFormInputType } from './types';
import { useUpdateProof } from './use-update-proof';

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

  const { claimRewards } = useClaimRewards({
    onConfirm: networkData.revalidate,
    onRetry: retryFire,
  });

  const value = networkData;

  const formControllerValue: FormControllerContextValueType<ClaimRewardsFormInputType> =
    useMemo(
      () => ({
        onSubmit: claimRewards,
        retryEvent,
      }),
      [claimRewards, retryEvent],
    );

  return (
    <FormProvider {...formObject}>
      <ClaimRewardsFormDataContext.Provider value={value}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </ClaimRewardsFormDataContext.Provider>
    </FormProvider>
  );
};
