import { Button, IconWarning, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ConfirmModalProps, getUseConfirmModal } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';

const WARNING_ICON_STYLE = { color: 'var(--lido-app-ui-color-icons-warning)' };

export const ConfirmDeleteKeyModalApp: FC<
  ConfirmModalProps & { open?: boolean }
> = ({ open, onConfirm, onReject }) => (
  <FormModalShell
    open={open}
    onClose={onReject}
    title="Are you sure you want to delete the key?"
    subtitle="You are deleting the key from the .json file"
    data-testid="confirmDeleteKeyModal"
  >
    <Stack direction="column" gap={24} align="center">
      <IconWarning width={40} height={40} style={WARNING_ICON_STYLE} />
      <Button
        fullWidth
        onClick={onConfirm}
        data-testid="confirmDeleteKeyButton"
      >
        Delete
      </Button>
    </Stack>
  </FormModalShell>
);

export const useConfirmDeleteKeyModal = getUseConfirmModal(
  ConfirmDeleteKeyModalApp,
);
