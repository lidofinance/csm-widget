import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { FC, MouseEventHandler, PropsWithChildren, useCallback } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';
import { useDisconnectWallet } from '../use-disconnect-wallet';

export const Disconnect: FC<
  PropsWithChildren<WithMatomoEvent<ButtonProps>>
> = ({
  children,
  matomoEvent = MATOMO_CLICK_EVENTS_TYPES.disconnectWallet,
  onClick,
  ...rest
}) => {
  const disconnect = useDisconnectWallet();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      trackMatomoEvent(matomoEvent);
      disconnect();
      onClick?.(e);
    },
    [disconnect, matomoEvent, onClick],
  );

  return (
    <Button onClick={handleClick} data-testid="disconnectBtn" {...rest}>
      {children ?? 'Disconnect'}
    </Button>
  );
};
