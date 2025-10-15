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
    <Modal {...props} onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            Two transactions required
          </Text>
          <Text size="xs" color="secondary">
            To ensure correct positioning of the new keys in the priority queue,
            you will need to perform two transactions:
          </Text>
          <Text size="xs" color="secondary">
            <ol>
              <li>
                First transaction will transfer your keys to the priority queue
              </li>
              <li>
                Second transaction will cleanup the queue to maintain correct
                priority for your new keys
              </li>
            </ol>
          </Text>
        </Stack>

        <Button fullwidth onClick={onConfirm}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
};
