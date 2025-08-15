import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { DisabledInputAmount, Stack } from 'shared/components';
import { EjectKeysFormInputType } from '../context';

export const AmountInput = () => {
  const { feeAmount } = useWatch<EjectKeysFormInputType>();

  return (
    <Stack direction="column" gap="xs">
      <DisabledInputAmount
        isLocked="Key ejection cost is a network fee required to cover the cost to trigger withdrawal from the Execution layer."
        amount={feeAmount}
        token={TOKENS.eth}
        label="Estimated ejection cost"
        fullwidth
        data-testid="ejectionCostAmountInput"
      />
      <Text size="xxs" color="secondary">
        Will be deducted from your <b>wallet balance</b>
      </Text>
    </Stack>
  );
};
