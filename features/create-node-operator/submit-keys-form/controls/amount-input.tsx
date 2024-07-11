import { useWatch } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { SubmitKeysFormInputType } from '../context/types';
import { useSubmitKeysFormData } from '../context';

export const AmountInput = () => {
  const token = useWatch<SubmitKeysFormInputType, 'token'>({ name: 'token' });
  const { bondAmount } = useSubmitKeysFormData();

  return (
    <InputAmount
      isLocked={true}
      value={bondAmount}
      label={`${getTokenDisplayName(token)} amount`}
      fullwidth
    />
  );
};
