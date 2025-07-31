import { useFormState, useWatch } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';
import { getTokenDisplayName } from 'utils';
import { SubmitKeysFormInputType } from '../context';

export const AmountInput = () => {
  const [token, bondAmount] = useWatch<
    SubmitKeysFormInputType,
    ['token', 'bondAmount']
  >({ name: ['token', 'bondAmount'] });
  const { errors } = useFormState<SubmitKeysFormInputType>();

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
