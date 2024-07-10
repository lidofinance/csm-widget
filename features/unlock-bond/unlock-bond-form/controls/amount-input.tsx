import { TOKENS } from 'consts/tokens';
import { FormTitle, Note } from 'shared/components';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls/token-amount-input-hook-form';
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
      <Note text="Locked bond can be compensated only in ETH" />
    </>
  );
};
