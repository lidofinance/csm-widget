import { FC } from 'react';
import { getUseConfirmModal } from 'shared/hooks';
import { SurveyConfirmModal, SurveyConfirmModalProps } from '../components';

const ConfirmRemoveContactsModalApp: FC<SurveyConfirmModalProps> = (props) => (
  <SurveyConfirmModal
    {...props}
    title="Are you sure you want to delete the provided contact information?"
    confirmLabel="Delete"
  >
    If deleted, the data will be permanently removed from the database
  </SurveyConfirmModal>
);

export const useConfirmRemoveContactsModal = getUseConfirmModal(
  ConfirmRemoveContactsModalApp,
);
