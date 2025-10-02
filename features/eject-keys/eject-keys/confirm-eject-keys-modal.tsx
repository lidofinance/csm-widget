import { Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';

export const ConfirmEjectKeysModal: ModalComponentType<ConfirmModalProps> = ({
  onConfirm,
  onReject,
  ...props
}) => {
  return (
    <Modal {...props} center onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            Selected keys will be ejected from the Consensus Layer
          </Text>
          <Text size="xs" color="secondary">
            Triggering the validator exit from the Execution Layer incurs
            network fees and serves as a last resort measure to exit the
            validator.{' '}
          </Text>
          <Text size="xs" color="secondary">
            Remember that validators exits don’t happen immediately and require
            some time to be processed, and that the bond is only released once
            the full withdrawal has been completed.
          </Text>
        </Stack>

        <Button fullwidth onClick={onConfirm}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
};
