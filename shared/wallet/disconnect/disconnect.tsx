import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { FC, MouseEventHandler, PropsWithChildren, useCallback } from 'react';
import { useDisconnect } from 'reef-knot/core-react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';

export const Disconnect: FC<
  PropsWithChildren<WithMatomoEvent<ButtonProps>>
> = ({
  children,
  matomoEvent = MATOMO_CLICK_EVENTS_TYPES.disconnectWallet,
  onClick,
  ...rest
}) => {
  const { disconnect } = useDisconnect();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      trackMatomoEvent(matomoEvent);
      disconnect?.();
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
