import { useFormState, useWatch } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';
import { getTokenDisplayName } from 'utils';
import { AddKeysFormInputType } from '../context';

export const AmountInput = () => {
  const [token, bondAmount] = useWatch<
    AddKeysFormInputType,
    ['token', 'bondAmount']
  >({ name: ['token', 'bondAmount'] });
  const { errors } = useFormState<AddKeysFormInputType>();

  return (
    <InputAmount
      isLocked="This field is calculated automatically based on the number of keys and the bond curve.  Follow the FAQ section to learn more"
      value={bondAmount}
      label={`${getTokenDisplayName(token)} amount`}
      error={errors.bondAmount?.message}
      fullwidth
      data-testid="amountInput"
    />
  );
};
