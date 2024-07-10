import { useWatch } from 'react-hook-form';
import { FormTitle } from 'shared/components';
import { TokenAmountInputHookForm } from 'shared/hook-form/controls/token-amount-input-hook-form';
import { ClaimBondFormInputType } from '../context';
import { useMaxClaimValue } from '../hooks/use-max-claim-value';

export const AmountInput: React.FC = () => {
  const token = useWatch<ClaimBondFormInputType, 'token'>({ name: 'token' });
  const max = useMaxClaimValue();

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
