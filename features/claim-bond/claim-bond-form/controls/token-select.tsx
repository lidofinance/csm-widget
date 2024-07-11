import { TOKENS } from 'consts/tokens';
import { FormTitle, TokenAmount } from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls/token-buttons-hook-form';
import { useClaimBondFormData } from '../context';
import { useMaxClaimValue } from '../hooks/use-max-claim-value';

export const TokenSelect: React.FC = () => {
  const { loading } = useClaimBondFormData();
  const isLoading = loading.isBondLoading || loading.isRewardsLoading;
  const availableToClaim = useMaxClaimValue();

  return (
    <>
      <FormTitle>Choose a token to add bond</FormTitle>
      <TokenButtonsHookForm
        disabled={availableToClaim[TOKENS.ETH].eq(0)}
        options={{
          [TOKENS.ETH]: (
            <TokenAmount
              token={TOKENS.ETH}
              amount={availableToClaim[TOKENS.ETH]}
              loading={isLoading}
            />
          ),
          [TOKENS.STETH]: (
            <TokenAmount
              token={TOKENS.STETH}
              amount={availableToClaim[TOKENS.STETH]}
              loading={isLoading}
            />
          ),
          [TOKENS.WSTETH]: (
            <TokenAmount
              token={TOKENS.WSTETH}
              amount={availableToClaim[TOKENS.WSTETH]}
              loading={isLoading || !availableToClaim[TOKENS.WSTETH]}
            />
          ),
        }}
      ></TokenButtonsHookForm>
    </>
  );
};
