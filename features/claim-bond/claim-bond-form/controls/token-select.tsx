import { TOKENS } from 'consts/tokens';
import { FormTitle, TokenAmount } from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';
import { useWatch } from 'react-hook-form';

export const TokenSelect: React.FC = () => {
  const claimRewards = useWatch<ClaimBondFormInputType, 'claimRewards'>({
    name: 'claimRewards',
  });
  const { loading, maxValues } = useClaimBondFormData();
  const isLoading = loading.isBondLoading || loading.isRewardsLoading;

  return (
    <>
      <FormTitle>Choose a token to claim</FormTitle>
      <TokenButtonsHookForm
        disabled={maxValues?.[TOKENS.ETH][Number(claimRewards)]?.eq(0)}
        options={{
          [TOKENS.ETH]: (
            <TokenAmount
              token={TOKENS.ETH}
              amount={maxValues?.[TOKENS.ETH][Number(claimRewards)]}
              loading={isLoading}
            />
          ),
          [TOKENS.STETH]: (
            <TokenAmount
              token={TOKENS.STETH}
              amount={maxValues?.[TOKENS.STETH][Number(claimRewards)]}
              loading={isLoading}
            />
          ),
          [TOKENS.WSTETH]: (
            <TokenAmount
              token={TOKENS.WSTETH}
              amount={maxValues?.[TOKENS.WSTETH][Number(claimRewards)]}
              loading={isLoading || loading.isMaxValuesLoading}
            />
          ),
        }}
      ></TokenButtonsHookForm>
    </>
  );
};
