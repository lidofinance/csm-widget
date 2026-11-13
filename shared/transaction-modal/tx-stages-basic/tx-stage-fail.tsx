import { FC, ReactNode, useCallback, useState } from 'react';
import { Button } from '@lidofinance/lido-app-ui';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { useModalRetry } from 'shared/transaction-modal/transaction-modal';
import type { ClosableOnLedgerStage } from 'shared/transaction-modal/is-closable-on-ledger';
import { ErrorCode } from 'utils';
import { ERROR_META } from './error-messages';

type TxStageFailProps = {
  code?: ErrorCode;
  title?: string;
  error?: ReactNode;
};

export const TxStageFail: FC<TxStageFailProps> & ClosableOnLedgerStage = ({
  code = ErrorCode.SOMETHING_WRONG,
  title = 'Transaction Failed',
  error,
}) => {
  const onRetry = useModalRetry();
  const [isLoading, setLoading] = useState(false);
  const handleRetry = useCallback(() => {
    setLoading(true);
    onRetry?.();
  }, [onRetry]);

  const meta = ERROR_META[code];
  const showAction = meta.retryable && !!onRetry;
  const actionLabel = meta.actionLabel ?? 'Retry';

  return (
    <TransactionModalContent
      status="error"
      title={title}
      description={error ?? meta.message}
      footer={
        showAction && (
          <Button variant="outline" loading={isLoading} onClick={handleRetry}>
            {actionLabel}
          </Button>
        )
      }
    />
  );
};

// Terminal stage: dismissible even on Ledger (modal is otherwise locked while
// a signature is pending).
TxStageFail.isClosableOnLedger = true;
