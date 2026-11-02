import { FC, ReactNode, useCallback, useState } from 'react';
import { Loader } from '@lidofinance/lido-ui';
import { Button } from '@lidofinance/lido-app-ui';
import { useFormUi } from 'shared/hook-form/form-ui';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { useModalRetry } from 'shared/transaction-modal/transaction-modal';
import type { ClosableOnLedgerStage } from 'shared/transaction-modal/is-closable-on-ledger';
import { ErrorCode } from 'utils';
import { StageIconFail } from './icons';
import { LoaderWrapper, RetryButtonStyled } from './styles';
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
  const ui = useFormUi();
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
      icon={<StageIconFail />}
      description={error ?? meta.message}
      footer={
        ui === 'app' &&
        showAction && (
          <Button variant="outline" loading={isLoading} onClick={handleRetry}>
            {actionLabel}
          </Button>
        )
      }
      footerHint={
        ui === 'legacy' &&
        showAction &&
        (!isLoading ? (
          <RetryButtonStyled onClick={handleRetry}>
            {actionLabel}
          </RetryButtonStyled>
        ) : (
          <LoaderWrapper>
            <Loader size="small" data-testid="loader" />
          </LoaderWrapper>
        ))
      }
    />
  );
};

// Terminal stage: dismissible even on Ledger (modal is otherwise locked while
// a signature is pending).
TxStageFail.isClosableOnLedger = true;
