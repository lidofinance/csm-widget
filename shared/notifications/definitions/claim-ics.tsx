import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { trackMatomoEvent } from 'utils';
import type { AlertDefinition } from '../types';

export const claimIcsDefinition: AlertDefinition = {
  severity: 'normal',
  title: 'You have a new operator type to be claimed',
  suppressedRoutes: [PATH.TYPE_ICS_CLAIM, PATH.CREATE],
  testId: 'claimIcsAlert',
  Body: () => (
    <>
      The Identified Community Staker type is now available to be claimed for
      your node operator
    </>
  ),
  Actions: ({ onNavigate }) => (
    <Button
      size="small"
      variant="outline"
      href={PATH.TYPE_ICS_CLAIM}
      onClick={() => {
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.claimIcsLinkAlert);
        onNavigate();
      }}
    >
      Go to Claim page
    </Button>
  ),
};
