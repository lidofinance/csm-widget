import { Button, Notification } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

export const AlertExpiredLockedBond: FC = () => (
  <Notification
    fluid
    title="Your locked bond has expired"
    actions={
      <Button
        size="small"
        variant="outline"
        href={PATH.BOND_UNLOCK}
        onClick={() =>
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.expiredLockedBondLinkAlert)
        }
      >
        Unlock bond
      </Button>
    }
  >
    The lock period has ended. You can unlock your bond now (no compensation
    required).
  </Notification>
);
