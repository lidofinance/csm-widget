import { FC, useCallback, useState } from 'react';

import { Loader } from '@lidofinance/lido-ui';
import { TransactionModalContent } from 'shared/transaction-modal/transaction-modal-content';
import { StageIconFail } from './icons';
import { LoaderWrapper, RetryButtonStyled } from './styles';
import { ErrorCode } from 'utils/getErrorCode';
import { ErrorMessages } from './error-messages';

type TxStageFailProps = {
  code?: ErrorCode;
  onRetry?: React.MouseEventHandler<HTMLSpanElement>;
};

export const TxStageFail: FC<TxStageFailProps> = ({
  code = ErrorCode.SOMETHING_WRONG,
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
      title="Transaction Failed"
      icon={<StageIconFail />}
      description={ErrorMessages[code]}
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
