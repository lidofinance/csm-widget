import { useWatch } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { SubmitKeysFormInputType } from '../context/types';

export const TokenAmountInput = () => {
  const [token, bondAmount] = useWatch<
    SubmitKeysFormInputType,
    ['token', 'bondAmount']
  >({ name: ['token', 'bondAmount'] });

  return (
    <InputAmount
      isLocked={true}
      value={bondAmount}
      label={`${getTokenDisplayName(token)} amount`}
      fullwidth
    />
  );
};
