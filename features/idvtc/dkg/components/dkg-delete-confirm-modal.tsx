import { Body, Button, Stack } from '@lidofinance/lido-app-ui';
import type { ModalComponentType } from 'providers/modal-provider';
import { ConfirmModalProps, getUseConfirmModal } from 'shared/hooks';
import { FormModalShell } from 'shared/transaction-modal/form-modal-shell';

type DkgDeleteConfirmProps = ConfirmModalProps & { fileName: string };

export const DkgDeleteConfirmModal: ModalComponentType<
  DkgDeleteConfirmProps
> = ({ open, fileName, onConfirm, onReject }) => (
  <FormModalShell open={open} onClose={onReject} title="Delete file">
    <Stack direction="column" gap={24}>
      <Body color="secondary">
        Delete <b>{fileName}</b>? This cannot be undone.
      </Body>
      <Button fullWidth onClick={onConfirm}>
        Delete
      </Button>
    </Stack>
  </FormModalShell>
);

export const useDkgDeleteConfirm = getUseConfirmModal<{ fileName: string }>(
  DkgDeleteConfirmModal,
);
