import { useWatch } from 'react-hook-form';
import { FormTitle } from 'shared/components';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls/token-amount-input-hook-form';
import { AddBondFormInputType } from '../context';
import { useMaxValue } from '../hooks/use-max-value';

export const AmountInput: React.FC = () => {
  const token = useWatch<AddBondFormInputType, 'token'>({ name: 'token' });
  const max = useMaxValue(token);

  // TODO: reset amount on token switch
  return (
    <>
      <FormTitle>Enter token amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="amount"
        token={token}
        maxValue={max}
      />
    </>
  );
};
