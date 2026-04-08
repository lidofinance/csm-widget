import { useModalActions } from 'providers/modal-provider';
import { useCallback, useEffect, useRef } from 'react';
import { TransactionModal, useTransactionModal } from '../transaction-modal';
import { useDappStatus } from 'modules/web3';
import type { TransactionModalTransitStage } from './use-transaction-modal-stage';

export const useTransitStage = (): TransactionModalTransitStage => {
  const { isAccountActive } = useDappStatus();
  const { openModal } = useTransactionModal();
  const { closeModal } = useModalActions();
  const isMountedRef = useRef(true);

  const transitStage: TransactionModalTransitStage = useCallback(
    (TxStageEl, modalProps = {}) => {
      if (!isMountedRef.current) return;
      openModal({
        children: TxStageEl,
        ...modalProps,
      });
    },
    [openModal],
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
