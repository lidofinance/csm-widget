import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { DisabledInputAmount, Stack } from 'shared/components';
import { useRemoveKeysFormData } from '../context';

export const AmountInput = () => {
  const { removalFee } = useRemoveKeysFormData();

  return (
    <Stack direction="column" gap="xs">
      <DisabledInputAmount
        isLocked="Key deletion incurs a removal charge, deducted from the node operator's bond. This charge covers the maximum possible operational costs of queue processing."
        amount={removalFee}
        token={TOKENS.steth}
        label="Removal fee"
        fullwidth
        data-testid="ejectionCostAmountInput"
      />
      <Text size="xxs" color="secondary">
        Will be deducted from your <b>bond balance</b>
      </Text>
    </Stack>
  );
};
