import { FormTitle, TokenAmount } from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { useAddBondFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const TokenSelect: React.FC = () => {
  const { ethBalance, stethBalance, wstethBalance, loading } =
    useAddBondFormData();

  return (
    <>
      <FormTitle>Choose bond token</FormTitle>
      <TokenButtonsHookForm
        options={{
          [TOKENS.eth]: (
            <TokenAmount
              token={TOKENS.eth}
              amount={ethBalance}
              loading={loading.isEthBalanceLoading}
            />
          ),
          [TOKENS.steth]: (
            <TokenAmount
              token={TOKENS.steth}
              amount={stethBalance}
              loading={loading.isStethBalanceLoading}
            />
          ),
          [TOKENS.wsteth]: (
            <TokenAmount
              token={TOKENS.wsteth}
              amount={wstethBalance}
              loading={loading.isWstethBalanceLoading}
            />
          ),
        }}
      />
    </>
  );
};
