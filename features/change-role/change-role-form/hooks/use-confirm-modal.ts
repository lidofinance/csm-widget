import { getUseConfirmModal } from 'shared/hooks';
import { ConfirmChangeRoleModalApp } from '../confirm-change-role-modal-app';

export const useConfirmChangeRoleModal = getUseConfirmModal<{
  showRewards: boolean;
  isProposal: boolean;
  showRepropose: boolean;
}>(ConfirmChangeRoleModalApp);
