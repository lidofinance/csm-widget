import { Button, Modal, Text } from '@lidofinance/lido-ui';
import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';

export const ConfirmEraseModal: ModalComponentType<ConfirmModalProps> = ({
  onConfirm,
  onReject,
  ...props
}) => {
  return (
    <Modal {...props} onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            Are you sure you want to erase your data from the database?
          </Text>
          <Text size="xs" color="secondary">
            If the data is erased, it will be deleted from the database;
            however, the historic usage of the data for the compilation of
            aggregate statistics will remain in the previous VaNOM reports.
          </Text>
        </Stack>

        <Stack>
          <Button fullwidth color="error" onClick={onConfirm}>
            Continue
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

import { getUseConfirmModal } from 'shared/hooks';

export const useConfirmEraseModal = getUseConfirmModal(ConfirmEraseModal);
