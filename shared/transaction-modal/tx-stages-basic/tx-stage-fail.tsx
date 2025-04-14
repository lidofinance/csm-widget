import { FC, ReactNode, useCallback, useState } from 'react';

import { Loader } from '@lidofinance/lido-ui';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { StageIconFail } from './icons';
import { LoaderWrapper, RetryButtonStyled } from './styles';
import { ErrorCode } from 'utils/getErrorCode';
import { ErrorMessages } from './error-messages';

type TxStageFailProps = {
  code?: ErrorCode;
  title?: string;
  onRetry?: React.MouseEventHandler<HTMLSpanElement>;
  error?: ReactNode;
};

export const TxStageFail: FC<TxStageFailProps> = ({
  code = ErrorCode.SOMETHING_WRONG,
  title = 'Transaction Failed',
  error,
  onRetry,
}) => {
  const [isLoading, setLoading] = useState(false);
  const handleRetry = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setLoading(true);
      onRetry?.(e);
    },
    [onRetry],
  );
  return (
    <TransactionModalContent
      title={title}
      icon={<StageIconFail />}
      description={error ?? ErrorMessages[code]}
      footerHint={
        code !== ErrorCode.NOT_ENOUGH_ETHER &&
        onRetry &&
        (!isLoading ? (
          <RetryButtonStyled onClick={handleRetry}>Retry</RetryButtonStyled>
        ) : (
          <LoaderWrapper>
            <Loader size="small" />
          </LoaderWrapper>
        ))
      }
    />
  );
};
