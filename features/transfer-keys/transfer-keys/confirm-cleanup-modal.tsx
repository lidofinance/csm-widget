import { Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';

export const ConfirmCleanupModal: ModalComponentType<ConfirmModalProps> = ({
  onConfirm,
  onReject,
  ...props
}) => {
  return (
    <Modal {...props} center onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Text size="xs" color="secondary">
          To ensure correct positioning of the new keys in the priority queue,
          you will need to perform two transactions: Transfer keys and Cleanup.
        </Text>

        <Button fullwidth onClick={onConfirm}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
};
