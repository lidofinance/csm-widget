import { createContext, useContext } from 'react';
import { Modal } from '@lidofinance/lido-ui';
import { useConnectorInfo } from 'reef-knot/core-react';
import { getUseModal, ModalComponentType } from 'providers/modal-provider';
import { getFormRetry } from 'shared/hook-form/form-controller/form-retry';
import { isClosableOnLedgerStage } from './is-closable-on-ledger';

const ModalRetryContext = createContext<(() => void) | undefined>(undefined);
export const useModalRetry = () => useContext(ModalRetryContext);

type TransactionModalProps = {
  children?: React.ReactNode;
};

export const TransactionModal: ModalComponentType<TransactionModalProps> = ({
  open,
  onClose,
  children,
  ...props
}) => {
  const { isLedger } = useConnectorInfo();
  // Terminal stages (success / fail) mark themselves dismissible; every other
  // stage keeps the modal locked while a Ledger signature is pending.
  const isClosable = !isLedger || isClosableOnLedgerStage(children);
  const onRetry = getFormRetry();

  return (
    <Modal
      {...props}
      open={open && Boolean(children)}
      onClose={isClosable ? onClose : undefined}
    >
      <ModalRetryContext.Provider value={onRetry}>
        {children}
      </ModalRetryContext.Provider>
    </Modal>
  );
};

export const useTransactionModal = getUseModal(TransactionModal);
