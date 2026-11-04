import type { ModalComponentType } from 'providers/modal-provider';
import { ConfirmModalProps } from 'shared/hooks';
import { ConfirmCustomAddressesModalApp } from './confirm-custom-addresses-modal-app';

type Props = {
  rewardsAddress?: string;
  managerAddress?: string;
  extendedManagerPermissions: boolean;
};

export const ConfirmCustomAddressesModal: ModalComponentType<
  ConfirmModalProps & Props
> = ({
  open,
  rewardsAddress,
  managerAddress,
  extendedManagerPermissions,
  onConfirm,
  onReject,
}) => (
  <ConfirmCustomAddressesModalApp
    open={open}
    rewardsAddress={rewardsAddress}
    managerAddress={managerAddress}
    extendedManagerPermissions={extendedManagerPermissions}
    onConfirm={onConfirm}
    onReject={onReject}
  />
);
