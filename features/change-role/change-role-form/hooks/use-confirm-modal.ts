import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmChangeRoleModal } from '../confirm-change-role-modal';

export const useConfirmChangeRoleModal = getUseConfirmModal<{
  showRewards: boolean;
  isProposal: boolean;
  showRepropose: boolean;
}>(ConfirmChangeRoleModal);
