import { Button, Modal, Text } from '@lidofinance/lido-ui';
import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps, getUseConfirmModal } from 'shared/hooks';

type DkgDeleteConfirmProps = ConfirmModalProps & { fileName: string };

export const DkgDeleteConfirmModal: ModalComponentType<
  DkgDeleteConfirmProps
> = ({ fileName, onConfirm, onReject, ...props }) => (
  <Modal {...props} onClose={onReject} title="Delete file">
    <Stack direction="column" gap="xxl">
      <Text size="xs" color="secondary">
        Delete <b>{fileName}</b>? This cannot be undone.
      </Text>
      <Button fullwidth size="sm" onClick={onConfirm}>
        Delete
      </Button>
    </Stack>
  </Modal>
);

export const useDkgDeleteConfirm = getUseConfirmModal<{ fileName: string }>(
  DkgDeleteConfirmModal,
);
