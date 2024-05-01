import { InputGroupHookForm } from 'shared/hook-form/controls/input-group-hook-form';
import { TokenAmountInput } from './token-amount-input';
import { TokenSelectHookForm } from 'shared/hook-form/controls/token-select-hook-form';

export const AmountInput: React.FC = () => {
  return (
    <InputGroupHookForm errorField="amount">
      <TokenSelectHookForm />
      <TokenAmountInput />
    </InputGroupHookForm>
  );
};
