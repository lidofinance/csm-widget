import { FormTitle, Note } from 'shared/components';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';
import { useMaxValue } from '../hooks/use-max-value';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

export const AmountInput: React.FC = () => {
  const max = useMaxValue();

  // TODO: disable
  return (
    <>
      <FormTitle>Enter token amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="amount"
        token={TOKENS.eth}
        maxValue={max}
      />
      <Note>Locked bond can be compensated only in ETH</Note>
    </>
  );
};
