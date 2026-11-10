import { FC } from 'react';
import { getUseConfirmModal } from 'shared/hooks';
import { SurveyConfirmModal, SurveyConfirmModalProps } from '../components';

const ConfirmRemoveSetupModalApp: FC<SurveyConfirmModalProps> = (props) => (
  <SurveyConfirmModal
    {...props}
    title="Are you sure you want to delete filled contact info?"
    confirmLabel="Delete"
  >
    If the data is deleted, it will be deleted from the database
  </SurveyConfirmModal>
);

export const useConfirmRemoveSetupModal = getUseConfirmModal(
  ConfirmRemoveSetupModalApp,
);
