import { useWatch } from 'react-hook-form';
import { FormTitle } from 'shared/components';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls/token-amount-input-hook-form';
import { AddBondFormInputType } from '../context';

export const AmountInput: React.FC = () => {
  const token = useWatch<AddBondFormInputType, 'token'>({ name: 'token' });

  // TODO: max amount
  return (
    <>
      <FormTitle>Enter token amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="amount"
        token={token}
        data-testid="stakeInput"
      />
    </>
  );
};
