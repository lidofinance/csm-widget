import { Button, Modal, Text } from '@lidofinance/lido-ui';
import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps, getUseConfirmModal } from 'shared/hooks';

type DkgDeleteConfirmProps = ConfirmModalProps & { fileName: string };

export const DkgDeleteConfirmModal: ModalComponentType<
  DkgDeleteConfirmProps
> = ({ fileName, onConfirm, onReject, ...props }) => (
  <Modal {...props} onClose={onReject}>
    <Stack direction="column" gap="xxl">
      <Stack direction="column" gap="sm">
        <Text as="h5" size="sm" weight={700}>
          Delete file
        </Text>
        <Text size="xs" color="secondary">
          Delete <b>{fileName}</b>? This cannot be undone.
        </Text>
      </Stack>
      <Stack>
        <Button fullwidth color="secondary" onClick={onReject}>
          Cancel
        </Button>
        <Button fullwidth color="error" onClick={onConfirm}>
          Delete
        </Button>
      </Stack>
    </Stack>
  </Modal>
);

export const useDkgDeleteConfirm = getUseConfirmModal<{ fileName: string }>(
  DkgDeleteConfirmModal,
);
