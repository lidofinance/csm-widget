import { TOKENS } from 'consts/tokens';
import { FormTitle, Note } from 'shared/components';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';
import { useMaxValue } from '../hooks/use-max-value';

export const AmountInput: React.FC = () => {
  const max = useMaxValue();

  // TODO: disable
  return (
    <>
      <FormTitle>Enter token amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="amount"
        token={TOKENS.ETH}
        maxValue={max}
      />
      <Note>Locked bond can be compensated only in ETH</Note>
    </>
  );
};
