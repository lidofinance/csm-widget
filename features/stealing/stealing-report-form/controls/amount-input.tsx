import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FormTitle } from 'shared/components';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';

export const AmountInput: React.FC = () => {
  return (
    <>
      <FormTitle>Enter stealing amount</FormTitle>
      <TokenAmountInputHookForm fieldName="amount" token={TOKENS.eth} />
    </>
  );
};
