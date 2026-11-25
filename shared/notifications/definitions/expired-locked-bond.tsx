import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { trackMatomoEvent } from 'utils';
import type { AlertDefinition } from '../types';

export const expiredLockedBondDefinition: AlertDefinition = {
  severity: 'important',
  title: 'Your locked bond has expired',
  suppressedRoutes: [PATH.BOND_UNLOCK],
  Body: () => (
    <>
      The lock period has ended. You can unlock your bond now (no compensation
      required).
    </>
  ),
  Actions: ({ onNavigate }) => (
    <Button
      size="small"
      variant="outline"
      href={PATH.BOND_UNLOCK}
      onClick={() => {
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.expiredLockedBondLinkAlert);
        onNavigate();
      }}
    >
      Unlock bond
    </Button>
  ),
};
