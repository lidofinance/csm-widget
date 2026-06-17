import { FC, ReactNode, useCallback, useState } from 'react';
import { Loader } from '@lidofinance/lido-ui';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { useModalRetry } from 'shared/transaction-modal/transaction-modal';
import { ErrorCode } from 'utils';
import { StageIconFail } from './icons';
import { LoaderWrapper, RetryButtonStyled } from './styles';
import { ERROR_META, ErrorMessages } from './error-messages';

type TxStageFailProps = {
  code?: ErrorCode;
  title?: string;
  error?: ReactNode;
};

export const TxStageFail: FC<TxStageFailProps> = ({
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

  return (
    <TransactionModalContent
      title={title}
      icon={<StageIconFail />}
      description={error ?? ErrorMessages[code]}
      footerHint={
        showAction &&
        (!isLoading ? (
          <RetryButtonStyled onClick={handleRetry}>
            {meta.actionLabel ?? 'Retry'}
          </RetryButtonStyled>
        ) : (
          <LoaderWrapper>
            <Loader size="small" />
          </LoaderWrapper>
        ))
      }
    />
  );
};
