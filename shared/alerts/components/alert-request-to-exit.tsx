import { Button, Notification } from '@lidofinance/lido-app-ui';
import { HOW_TO_EXIT_VALIDATOR_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

import Arrow from 'assets/icons/arrow-right.svg?react';

export const AlertRequestToExit: FC = () => (
  <Notification
    title="You have an Exit Request"
    actions={
      <Button
        size="small"
        variant="outline"
        href={HOW_TO_EXIT_VALIDATOR_LINK}
        iconRight={<Arrow />}
        onClick={() =>
          trackMatomoEvent(
            MATOMO_CLICK_EVENTS_TYPES.howToExitLinkRequestToExitAlert,
          )
        }
      >
        How to exit?
      </Button>
    }
  >
    Your validator has been requested to exit by the Lido protocol. You need to
    exit the validator from the CL as soon as possible to avoid the penalty
    measures
  </Notification>
);
