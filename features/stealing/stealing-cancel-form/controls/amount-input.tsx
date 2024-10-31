import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormTitle } from 'shared/components';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls';
import { StealingCancelFormInputType } from '../context';

export const AmountInput: React.FC = () => {
  const maxAmount = useWatch<StealingCancelFormInputType, 'maxAmount'>({
    name: 'maxAmount',
  });

  return (
    <>
      <FormTitle>Enter cancellation amount</FormTitle>
      <TokenAmountInputHookForm
        fieldName="amount"
        token={TOKENS.ETH}
        maxValue={maxAmount}
      />
    </>
  );
};
