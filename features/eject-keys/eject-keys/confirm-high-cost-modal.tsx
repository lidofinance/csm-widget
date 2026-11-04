import { Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';
import { ConfirmHighCostModalApp } from './confirm-high-cost-modal-app';

export const ConfirmHighCostModal: ModalComponentType<ConfirmModalProps> = ({
  ui,
  onConfirm,
  onReject,
  ...props
}) => {
  if (ui === 'app') {
    return (
      <ConfirmHighCostModalApp
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
            High ejection cost detected
          </Text>
          <Text size="xs" color="secondary">
            The ejection cost per key is unusually high. You may want to wait
            for ejection fees to decrease.
          </Text>
          <Text size="xs" color="secondary">
            Are you sure you want to proceed?
          </Text>
        </Stack>

        <Stack gap="sm">
          <Button size="sm" fullwidth variant="outlined" onClick={onReject}>
            Later
          </Button>
          <Button size="sm" fullwidth onClick={onConfirm}>
            Continue anyway
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
