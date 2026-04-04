import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { DisabledInputAmount, Stack } from 'shared/components';
import { useUnlockBondFormData } from '../context';

export const CompensatingAmount: FC = () => {
  const { compensationAmount } = useUnlockBondFormData(true);

  if (!compensationAmount) return null;

  return (
    <Stack direction="column" gap="xs">
      <DisabledInputAmount
        isLocked="Penalty compensation is deducted from the node operator's bond and cannot exceed the excess bond."
        amount={compensationAmount}
        token={TOKENS.steth}
        label="Compensating amount"
        fullwidth
        data-testid="compensatingAmountInput"
      />
      <Text size="xxs" color="secondary">
        Will be deducted from your <b>bond balance</b>
      </Text>
    </Stack>
  );
};
