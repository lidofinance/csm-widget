import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FormTitle, TokenAmount } from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { useAddBondFormData } from '../context';

export const TokenSelect: React.FC = () => {
  const { ethBalance, stethBalance, wstethBalance } = useAddBondFormData(true);

  return (
    <>
      <FormTitle>Choose bond token</FormTitle>
      <TokenButtonsHookForm
        options={{
          [TOKENS.eth]: <TokenAmount token={TOKENS.eth} amount={ethBalance} />,
          [TOKENS.steth]: (
            <TokenAmount token={TOKENS.steth} amount={stethBalance} />
          ),
          [TOKENS.wsteth]: (
            <TokenAmount token={TOKENS.wsteth} amount={wstethBalance} />
          ),
        }}
      />
    </>
  );
};
