import { Button, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';

type ConfirmEjectKeysModalAppProps = ConfirmModalProps & { open?: boolean };

export const ConfirmEjectKeysModalApp: FC<ConfirmEjectKeysModalAppProps> = ({
  open,
  onConfirm,
  onReject,
}) => (
  <FormModalShell
    open={open}
    onClose={onReject}
    title="Selected keys will be ejected from the Consensus Layer"
    subtitle="Triggering the validator exit from the Execution Layer incurs network fees and serves as a last resort measure to exit the validator. Remember that validators exits don’t happen immediately and require some time to be processed, and that the bond is only released once the full withdrawal has been completed."
    data-testid="confirmEjectKeysModal"
  >
    <Stack direction="column">
      <Button onClick={onConfirm} data-testid="confirmEjectKeysButton">
        Continue and eject keys
      </Button>
    </Stack>
  </FormModalShell>
);
