import { Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';

export const ConfirmDisableTopUpModal: ModalComponentType<
  ConfirmModalProps
> = ({ onConfirm, onReject, ...props }) => {
  return (
    <Modal {...props} title="Confirm disabling top-ups" onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text size="sm" weight={700}>
            Are you sure you want to disable top-up deposits?
          </Text>
          <Text size="xs" color="secondary">
            Your operator will stop receiving top-up deposits. They can be
            enabled back only by the CMC.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Button fullwidth variant="outlined" onClick={onReject}>
            Cancel
          </Button>
          <Button fullwidth onClick={onConfirm}>
            Confirm
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
