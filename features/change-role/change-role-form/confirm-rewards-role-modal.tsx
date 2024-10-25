import { Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';

export const ConfirmRewardsRoleModal: ModalComponentType<ConfirmModalProps> = ({
  onConfirm,
  onReject,
  ...props
}) => {
  return (
    <Modal {...props} center onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            All rewards will be claimable to the proposed address
          </Text>
          <Text size="xs" color="secondary">
            After changing the Rewards Address, all rewards and excess bond
            accumulated on the bond balance can be claimed to the new Rewards
            address. In the event of validator withdrawal, the whole bond is
            also returned to the new address.
          </Text>
        </Stack>

        <Stack direction="column" gap="sm">
          <Button fullwidth onClick={onConfirm}>
            Continue
          </Button>
          <Text size="xxs" color="secondary">
            The change doesn’t apply immediately. To complete the address
            change, the owner of the new address must confirm the change
          </Text>
        </Stack>
      </Stack>
    </Modal>
  );
};
