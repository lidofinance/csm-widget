import { FC } from 'react';
import { getUseConfirmModal } from 'shared/hooks';
import { SurveyConfirmModal, SurveyConfirmModalProps } from '../components';

const ConfirmEraseModalApp: FC<SurveyConfirmModalProps> = (props) => (
  <SurveyConfirmModal
    {...props}
    title="Are you sure you want to erase your data from the database?"
    confirmLabel="Continue"
  >
    If the data is erased, it will be deleted from the database; however, the
    historic usage of the data for the compilation of aggregate statistics will
    remain in the previous VaNOM reports
  </SurveyConfirmModal>
);

export const useConfirmEraseModal = getUseConfirmModal(ConfirmEraseModalApp);
