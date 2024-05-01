import { useWatch } from 'react-hook-form';

import { TokenAmountInputHookForm } from 'shared/hook-form/controls/token-amount-input-hook-form';
import { AddBondFormInputType } from '../context/types';

export const TokenAmountInput = () => {
  const token = useWatch<AddBondFormInputType, 'token'>({ name: 'token' });
  // TODO: max amount

  return (
    <TokenAmountInputHookForm
      fieldName="amount"
      token={token}
      data-testid="stakeInput"
    />
  );
};
