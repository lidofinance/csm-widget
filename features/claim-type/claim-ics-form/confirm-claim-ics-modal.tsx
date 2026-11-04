import { Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';
import { ConfirmClaimIcsModalApp } from './confirm-claim-ics-modal-app';

export const ConfirmClaimIcsModal: ModalComponentType<ConfirmModalProps> = ({
  ui,
  onConfirm,
  onReject,
  ...props
}) => {
  if (ui === 'app') {
    return (
      <ConfirmClaimIcsModalApp
        open={props.open}
        onConfirm={onConfirm}
        onReject={onReject}
      />
    );
  }

  return (
    <Modal {...props} center onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            You are claiming the Identified Community Staker operator type
          </Text>
          <Text size="xs" color="secondary">
            This action is irreversible, you will not be able to claim your
            current operator type back
          </Text>
        </Stack>

        <Button fullwidth onClick={onConfirm}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
};
