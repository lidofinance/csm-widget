import { useModalActions } from 'providers/modal-provider';
import { useCallback, useEffect, useRef } from 'react';
import { useFormUi } from 'shared/hook-form/form-ui';
import { TransactionModal, useTransactionModal } from '../transaction-modal';
import { useDappStatus } from 'modules/web3';
import type { TransactionModalTransitStage } from './use-transaction-modal-stage';

export const useTransitStage = (): TransactionModalTransitStage => {
  const { isAccountActive } = useDappStatus();
  const { openModal } = useTransactionModal();
  const { closeModal } = useModalActions();
  const ui = useFormUi();
  const isMountedRef = useRef(true);

  const transitStage: TransactionModalTransitStage = useCallback(
    (TxStageEl, modalProps = {}) => {
      if (!isMountedRef.current) return;
      openModal({
        children: TxStageEl,
        ui,
        ...modalProps,
      });
    },
    [openModal, ui],
  );

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isAccountActive) {
      closeModal(TransactionModal);
    }
  }, [isAccountActive, closeModal]);

  return transitStage;
};
