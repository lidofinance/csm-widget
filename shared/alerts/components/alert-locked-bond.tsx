import { Button, Notification } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

export const AlertLockedBond: FC = () => (
  <Notification
    title="Your bond is locked"
    actions={
      <Button
        size="small"
        variant="outline"
        href={PATH.BOND_UNLOCK}
        onClick={() =>
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.unlockBondLinkAlert)
        }
      >
        Unlock bond
      </Button>
    }
  >
    Penalties have been applied to your Node Operator. If they aren’t covered,
    the corresponding amount of your bond may be burned. See details in the
    Locked Bond tab.
  </Notification>
);
