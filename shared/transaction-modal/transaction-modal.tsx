import { createContext, ReactNode, useContext } from 'react';
import { useConnectorInfo } from 'reef-knot';
import { getUseModal, ModalComponentType } from 'providers/modal-provider';
import { getFormRetry } from 'shared/hook-form/form-controller/form-retry';
import { FormModalShell } from './form-modal-shell';
import { isClosableOnLedgerStage } from './is-closable-on-ledger';

const ModalRetryContext = createContext<(() => void) | undefined>(undefined);
export const useModalRetry = () => useContext(ModalRetryContext);

type TransactionModalProps = {
  children?: ReactNode;
};

export const TransactionModal: ModalComponentType<TransactionModalProps> = ({
  open,
  onClose,
  children,
}) => {
  const { isLedger } = useConnectorInfo();
  // Terminal stages (success / fail) mark themselves dismissible; every other
  // stage keeps the modal locked while a Ledger signature is pending.
  const isClosable = !isLedger || isClosableOnLedgerStage(children);
  const onRetry = getFormRetry();

  return (
    <FormModalShell open={open} onClose={onClose} isClosable={isClosable}>
      {children ? (
        <ModalRetryContext.Provider value={onRetry}>
          {children}
        </ModalRetryContext.Provider>
      ) : null}
    </FormModalShell>
  );
};

export const useTransactionModal = getUseModal(TransactionModal);
