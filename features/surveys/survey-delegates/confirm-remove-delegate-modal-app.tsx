import { FC } from 'react';
import { Address } from 'shared/components/address';
import { getUseConfirmModal } from 'shared/hooks';
import { SurveyConfirmModal, SurveyConfirmModalProps } from '../components';

const ConfirmRemoveDelegateModalApp: FC<
  SurveyConfirmModalProps & { address: string }
> = ({ address, ...props }) => (
  <SurveyConfirmModal {...props} title="Remove delegate?" confirmLabel="Remove">
    <Address address={address} symbols={0} /> will no longer have delegate
    access
  </SurveyConfirmModal>
);

export const useConfirmRemoveDelegateModal = getUseConfirmModal(
  ConfirmRemoveDelegateModalApp,
);
