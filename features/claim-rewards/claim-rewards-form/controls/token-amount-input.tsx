import { useWatch } from 'react-hook-form';

import { TokenAmountInputHookForm } from 'shared/hook-form/controls/token-amount-input-hook-form';
import { ClaimRewardsFormInputType } from '../context/types';

export const TokenAmountInput = () => {
  const token = useWatch<ClaimRewardsFormInputType, 'token'>({ name: 'token' });
  // TODO: max amount

  return (
    <TokenAmountInputHookForm
      fieldName="amount"
      token={token}
      data-testid="stakeInput"
    />
  );
};
