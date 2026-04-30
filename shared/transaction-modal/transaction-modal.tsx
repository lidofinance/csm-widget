import { createContext, useContext } from 'react';
import { Modal } from '@lidofinance/lido-ui';
import { useConnectorInfo } from 'reef-knot/core-react';
import { getUseModal, ModalComponentType } from 'providers/modal-provider';
import { getFormRetry } from 'shared/hook-form/form-controller/form-retry';

const ModalRetryContext = createContext<(() => void) | undefined>(undefined);
export const useModalRetry = () => useContext(ModalRetryContext);

type TransactionModalProps = {
  isClosableOnLedger?: boolean;
  children?: React.ReactNode;
};

export const TransactionModal: ModalComponentType<TransactionModalProps> = ({
  open,
  isClosableOnLedger,
  onClose,
  children,
  ...props
}) => {
  const { isLedger } = useConnectorInfo();
  const isClosable = !isLedger || isClosableOnLedger;
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
