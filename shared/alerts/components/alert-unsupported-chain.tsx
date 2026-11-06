import { Notification } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useChainName } from 'shared/hooks';
import styled from 'styled-components';

const ErrorNotification = styled(Notification)`
  && {
    border-color: var(--lido-app-ui-color-border-error);
  }
`;

export const AlertUnsupportedChain: FC = () => {
  const chainName = useChainName(true);

  return (
    <ErrorNotification fluid title="Unsupported chain">
      Please switch to {chainName} in your wallet
    </ErrorNotification>
  );
};
