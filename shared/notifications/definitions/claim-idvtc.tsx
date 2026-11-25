import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { trackMatomoEvent } from 'utils';
import type { AlertDefinition } from '../types';

export const claimIdvtcDefinition: AlertDefinition = {
  severity: 'normal',
  title: 'You have a new operator type to be claimed',
  suppressedRoutes: [PATH.TYPE_IDVTC_CLAIM, PATH.CREATE],
  testId: 'claimIdvtcAlert',
  Body: () => (
    <>
      The Identified DVT Cluster type is now available to be claimed for your
      node operator
    </>
  ),
  Actions: ({ onNavigate }) => (
    <Button
      size="small"
      variant="outline"
      href={PATH.TYPE_IDVTC_CLAIM}
      onClick={() => {
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.claimIdvtcLinkAlert);
        onNavigate();
      }}
    >
      Go to Claim page
    </Button>
  ),
};
