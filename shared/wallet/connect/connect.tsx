import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';

import { WithMatomoEvent } from 'utils';
import { useConnectWallet } from './use-connect-wallet';

export const Connect: FC<PropsWithChildren<WithMatomoEvent<ButtonProps>>> = ({
  children,
  matomoEvent,
  onClick,
  ...rest
}) => {
  const { handleClick, disabled } = useConnectWallet(matomoEvent);

  return (
    <Button
      disabled={disabled}
      onClick={handleClick}
      data-testid="connectBtn"
      {...rest}
    >
      {children ?? 'Connect wallet'}
    </Button>
  );
};
