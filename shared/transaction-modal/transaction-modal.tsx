import { createContext, ReactNode, useContext } from 'react';
import { useConnectorInfo } from 'reef-knot/core-react';
import { getUseModal, ModalComponentType } from 'providers/modal-provider';
import { getFormRetry } from 'shared/hook-form/form-controller/form-retry';
import { FormUi, FormUiProvider } from 'shared/hook-form/form-ui';
import { FormModalShell } from './form-modal-shell';
import { isClosableOnLedgerStage } from './is-closable-on-ledger';

const ModalRetryContext = createContext<(() => void) | undefined>(undefined);
export const useModalRetry = () => useContext(ModalRetryContext);

type TransactionModalProps = {
  children?: ReactNode;
  ui?: FormUi;
};

export const TransactionModal: ModalComponentType<TransactionModalProps> = ({
  open,
  onClose,
  children,
  ui = 'legacy',
}) => {
  const { isLedger } = useConnectorInfo();
  // Terminal stages (success / fail) mark themselves dismissible; every other
  // stage keeps the modal locked while a Ledger signature is pending.
  const isClosable = !isLedger || isClosableOnLedgerStage(children);
  const onRetry = getFormRetry();

  return (
    <FormModalShell
      ui={ui}
      open={open}
      onClose={onClose}
      isClosable={isClosable}
    >
      {children ? (
        <FormUiProvider value={ui}>
          <ModalRetryContext.Provider value={onRetry}>
            {children}
          </ModalRetryContext.Provider>
        </FormUiProvider>
      ) : null}
    </FormModalShell>
  );
};

export const useTransactionModal = getUseModal(TransactionModal);
