import { Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';

export const ConfirmReproposeModal: ModalComponentType<ConfirmModalProps> = ({
  onConfirm,
  onReject,
  ...props
}) => {
  return (
    <Modal {...props} center onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            Only last proposed address change is valid
          </Text>
          <Text size="xs" color="secondary">
            When you propose a new address for change - the previous change
            proposal is voided.
          </Text>
        </Stack>

        <Button fullwidth onClick={onConfirm}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
};
