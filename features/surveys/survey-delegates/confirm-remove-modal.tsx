import { Button, Modal, Text } from '@lidofinance/lido-ui';
import type { ModalComponentType } from 'providers/modal-provider';
import { Stack } from 'shared/components';
import { ConfirmModalProps, getUseConfirmModal } from 'shared/hooks';
import { Address } from 'shared/components/address';

type ConfirmRemoveDelegateProps = ConfirmModalProps & {
  address: string;
};

export const ConfirmRemoveDelegateModal: ModalComponentType<
  ConfirmRemoveDelegateProps
> = ({ onConfirm, onReject, address, ...props }) => {
  return (
    <Modal {...props} onClose={onReject}>
      <Stack direction="column" gap="xxl">
        <Stack direction="column" gap="sm">
          <Text as="h5" size="sm" weight={700}>
            Remove delegate?
          </Text>
          <Text size="xs" color="secondary">
            <Address address={address} symbols={46} /> will no longer have
            delegate access.
          </Text>
        </Stack>

        <Stack>
          <Button fullwidth color="error" onClick={onConfirm}>
            Remove
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export const useConfirmRemoveDelegateModal = getUseConfirmModal(
  ConfirmRemoveDelegateModal,
);
