import { SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { AmountField, TextField } from 'shared/hook-form/fields';
import type { DelayedPenaltyCancelFormInputType } from './context/types';

export const DelayedPenaltyCancelFields: FC = () => {
  const maxAmount = useWatch<DelayedPenaltyCancelFormInputType, 'maxAmount'>({
    name: 'maxAmount',
  });

  return (
    <Stack direction="column" gap={32}>
      <Stack direction="column" gap={16}>
        <SectionTitle title="Specify Node Operator" />
        <TextField
          name="nodeOperatorId"
          label="Node Operator ID"
          inputMode="numeric"
        />
      </Stack>
      <Stack direction="column" gap={16}>
        <SectionTitle title="Enter cancellation amount" />
        <AmountField
          name="amount"
          label="ETH amount"
          token={TOKENS.eth}
          maxValue={maxAmount}
        />
      </Stack>
    </Stack>
  );
};
