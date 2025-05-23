import { useFormState, useWatch } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { SubmitKeysFormInputType } from '../context';

export const AmountInput = () => {
  const [token, bondAmount] = useWatch<
    SubmitKeysFormInputType,
    ['token', 'bondAmount']
  >({ name: ['token', 'bondAmount'] });
  const { errors } = useFormState<SubmitKeysFormInputType>();

  return (
    <InputAmount
      isLocked={true}
      value={bondAmount}
      label={`${getTokenDisplayName(token)} amount`}
      error={errors.bondAmount?.message}
      fullwidth
      data-testid={'amountInput'}
    />
  );
};
