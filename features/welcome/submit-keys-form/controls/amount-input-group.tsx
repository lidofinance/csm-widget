import { InputGroupHookForm } from 'shared/hook-form/controls/input-group-hook-form';
import { TokenAmountInput } from './token-amount-input';
import { TokenSelect } from './token-select';

export const AmountInputGroup: React.FC = () => {
  return (
    <InputGroupHookForm errorField="amount">
      <TokenSelect />
      <TokenAmountInput />
    </InputGroupHookForm>
  );
};
