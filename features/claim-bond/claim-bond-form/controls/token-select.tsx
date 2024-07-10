import { TOKENS } from 'consts/tokens';
import { FormTitle, TokenAmount } from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls/token-buttons-hook-form';
import { useWstethBySteth } from 'shared/hooks';
import { useClaimBondFormData } from '../context';
import { useMaxClaimValue } from '../hooks/use-max-claim-value';

export const TokenSelect: React.FC = () => {
  const { loading } = useClaimBondFormData();
  const isLoading = loading.isBondLoading || loading.isRewardsLoading;
  const availableToClaim = useMaxClaimValue();

  const { data: wstethAvailableToClaim, initialLoading: isWstethLoading } =
    useWstethBySteth(availableToClaim);

  return (
    <>
      <FormTitle>Choose a token to add bond</FormTitle>
      <TokenButtonsHookForm
        options={{
          [TOKENS.ETH]: (
            <TokenAmount
              token={TOKENS.ETH}
              amount={availableToClaim}
              loading={isLoading}
            />
          ),
          [TOKENS.STETH]: (
            <TokenAmount
              token={TOKENS.STETH}
              amount={availableToClaim}
              loading={isLoading}
            />
          ),
          [TOKENS.WSTETH]: (
            <TokenAmount
              token={TOKENS.WSTETH}
              amount={wstethAvailableToClaim}
              loading={isLoading || isWstethLoading}
            />
          ),
        }}
      ></TokenButtonsHookForm>
    </>
  );
};
