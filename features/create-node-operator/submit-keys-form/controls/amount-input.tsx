import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { AmountField } from 'shared/hook-form/fields';
import { getTokenDisplayName } from 'utils';
import { SubmitKeysFormInputType } from '../context';

export const AmountInput: FC = () => {
  const token = useWatch<SubmitKeysFormInputType, 'token'>({ name: 'token' });

  return (
    <AmountField
      name="bondAmount"
      locked
      token={token}
      label={`${getTokenDisplayName(token)} amount`}
      tooltip="This field is calculated automatically based on the number of keys and the bond curve. Follow the FAQ section to learn more."
    />
  );
};
