import { TOKENS } from 'consts/tokens';
import { FormTitle, TokenAmount } from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls/token-buttons-hook-form';
import { useSubmitKeysFormData } from '../context';

export const TokenSelect: React.FC = () => {
  const { etherBalance, stethBalance, wstethBalance, loading } =
    useSubmitKeysFormData();

  return (
    <>
      <FormTitle>Choose a token to upload a bond</FormTitle>
      <TokenButtonsHookForm
        options={{
          [TOKENS.ETH]: (
            <TokenAmount
              token={TOKENS.ETH}
              amount={etherBalance}
              loading={loading.isEtherBalanceLoading}
            />
          ),
          [TOKENS.STETH]: (
            <TokenAmount
              token={TOKENS.STETH}
              amount={stethBalance}
              loading={loading.isStethBalanceLoading}
            />
          ),
          [TOKENS.WSTETH]: (
            <TokenAmount
              token={TOKENS.WSTETH}
              amount={wstethBalance}
              loading={loading.isWstethBalanceLoading}
            />
          ),
        }}
      ></TokenButtonsHookForm>
    </>
  );
};
