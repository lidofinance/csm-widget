import { useWatch } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { AddKeysFormInputType } from '../context/types';
import { useAddKeysFormData } from '../context';

export const AmountInput = () => {
  const token = useWatch<AddKeysFormInputType, 'token'>({ name: 'token' });
  const { bondAmount } = useAddKeysFormData();

  return (
    <InputAmount
      isLocked={true}
      value={bondAmount}
      label={`${getTokenDisplayName(token)} amount`}
      fullwidth
    />
  );
};
