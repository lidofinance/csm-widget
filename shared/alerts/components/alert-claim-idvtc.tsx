import { Button, Notification } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

export const AlertClaimIdvtc: FC = () => (
  <Notification
    fluid
    title="You have a new operator type to be claimed"
    data-testid="claimIdvtcAlert"
    actions={
      <Button
        size="small"
        variant="outline"
        href={PATH.TYPE_IDVTC_CLAIM}
        onClick={() =>
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.claimIdvtcLinkAlert)
        }
      >
        Go to Claim page
      </Button>
    }
  >
    The Identified DVT Cluster type is now available to be claimed for your node
    operator.
  </Notification>
);
