import { Button, Notification } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

export const AlertClaimIcs: FC = () => (
  <Notification
    title="You have a new operator type to be claimed"
    data-testid="claimIcsAlert"
    actions={
      <Button
        size="small"
        variant="outline"
        href={PATH.TYPE_ICS_CLAIM}
        onClick={() =>
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.claimIcsLinkAlert)
        }
      >
        Go to Claim page
      </Button>
    }
  >
    The Identified Community Staker type is now available to be claimed for your
    node operator
  </Notification>
);
