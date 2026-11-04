import { Button, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ConfirmModalProps } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';

type ConfirmClaimIcsModalAppProps = ConfirmModalProps & { open?: boolean };

export const ConfirmClaimIcsModalApp: FC<ConfirmClaimIcsModalAppProps> = ({
  open,
  onConfirm,
  onReject,
}) => (
  <FormModalShell
    ui="app"
    open={open}
    onClose={onReject}
    title="You are claiming the Identified Community Staker operator type"
    subtitle="This action is irreversible, you will not be able to claim your current operator type back"
    data-testid="confirmClaimIcsModal"
  >
    <Stack direction="column" gap={24}>
      <Button onClick={onConfirm}>Continue</Button>
    </Stack>
  </FormModalShell>
);
