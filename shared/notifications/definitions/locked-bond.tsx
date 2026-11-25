import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { trackMatomoEvent } from 'utils';
import type { AlertDefinition } from '../types';

export const lockedBondDefinition: AlertDefinition = {
  severity: 'important',
  title: 'Your bond is locked',
  suppressedRoutes: [PATH.BOND_UNLOCK],
  Body: () => (
    <>
      Penalties have been applied to your Node Operator. If they aren’t covered,
      the corresponding amount of your bond may be burned. See details in the
      Locked Bond tab.
    </>
  ),
  Actions: ({ onNavigate }) => (
    <Button
      size="small"
      variant="outline"
      href={PATH.BOND_UNLOCK}
      onClick={() => {
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.unlockBondLinkAlert);
        onNavigate();
      }}
    >
      Unlock bond
    </Button>
  ),
};
