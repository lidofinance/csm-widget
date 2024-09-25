import { TOKENS } from 'consts/tokens';
import { FormTitle } from 'shared/components';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';

export const AmountInput: React.FC = () => {
  return (
    <>
      <FormTitle>Enter cancelation amount</FormTitle>
      <TokenAmountInputHookForm fieldName="amount" token={TOKENS.ETH} />
    </>
  );
};
