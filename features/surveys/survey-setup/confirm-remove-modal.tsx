import { Button, Modal, Text } from '@lidofinance/lido-ui';
import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';
import { getUseConfirmModal } from 'shared/hooks';

export const ConfirmRemoveModal: ModalComponentType<ConfirmModalProps> = ({
  onConfirm,
  onReject,
  ...props
}) => {
  return (
    <Modal {...props} onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            Are you sure you want to delete filled contact info?
          </Text>
          <Text size="xs" color="secondary">
            If the data is deleted, it will be deleted from the database.
          </Text>
        </Stack>

        <Stack>
          <Button fullwidth color="error" onClick={onConfirm}>
            Delete
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export const useConfirmRemoveModal = getUseConfirmModal(ConfirmRemoveModal);
