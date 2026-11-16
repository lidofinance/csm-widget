import { SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { AmountField, TextField } from 'shared/hook-form/fields';

export const DelayedPenaltyReportFields: FC = () => (
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
      <SectionTitle title="Enter penalty amount" />
      <AmountField name="amount" label="ETH amount" token={TOKENS.eth} />
    </Stack>
    <Stack direction="column" gap={16}>
      <SectionTitle title="Enter Penalty Type" />
      <TextField name="penaltyType" label="Penalty Type" placeholder="0x…" />
    </Stack>
    <Stack direction="column" gap={16}>
      <SectionTitle title="Enter Details" />
      <TextField name="details" label="Details" />
    </Stack>
  </Stack>
);
