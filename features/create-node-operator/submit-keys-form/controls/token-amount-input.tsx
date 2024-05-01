import { useWatch } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { useSubmitKeysFormData } from '../context/submit-keys-form-context';
import { SubmitKeysFormInputType } from '../context/types';

export const TokenAmountInput = () => {
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
