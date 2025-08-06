import { Text } from '@lidofinance/lido-ui';
import { DisabledInputAmount, Stack } from 'shared/components';
import { useEjectKeysFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const AmountInput = () => {
  const { withdrawalRequestFee } = useEjectKeysFormData();

  return (
    <Stack direction="column" gap="xs">
      <DisabledInputAmount
        isLocked="Key ejection cost is a network fee required to cover the cost to trigger withdrawal from the Execution layer."
        amount={withdrawalRequestFee}
        token={TOKENS.eth}
        label="Ejection cost"
        fullwidth
        data-testid="ejectionCostAmountInput"
      />
      <Text size="xxs" color="secondary">
        Will be deducted from your <b>wallet balance</b>
      </Text>
    </Stack>
  );
};
