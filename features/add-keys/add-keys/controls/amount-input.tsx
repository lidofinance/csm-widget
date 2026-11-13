import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { AmountField } from 'shared/hook-form/fields';
import { getTokenDisplayName } from 'utils';
import { AddKeysFormInputType } from '../context';

export const AmountInput: FC = () => {
  const token = useWatch<AddKeysFormInputType, 'token'>({ name: 'token' });

  return (
    <AmountField
      name="bondAmount"
      locked
      token={token}
      label={`${getTokenDisplayName(token)} amount`}
    />
  );
};
