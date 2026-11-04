import { SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { AmountField } from 'shared/hook-form/fields';
import { getAddBondBalance } from '../add-bond-state';
import { AddBondFormInputType, useAddBondFormData } from '../context';

export const AmountInput: FC = () => {
  const token = useWatch<AddBondFormInputType, 'token'>({ name: 'token' });
  const { ethBalance, stethBalance, wstethBalance } = useAddBondFormData(true);
  const balance = getAddBondBalance(token, {
    ethBalance,
    stethBalance,
    wstethBalance,
  });

  return (
    <Stack direction="column" gap={16}>
      <SectionTitle title="Enter token amount" />
      <AmountField
        name="bondAmount"
        label="Amount to add"
        token={token}
        maxValue={balance}
        balance={<FormatToken amount={balance} token={token} />}
      />
    </Stack>
  );
};
