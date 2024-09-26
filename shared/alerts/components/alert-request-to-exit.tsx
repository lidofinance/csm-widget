import { FC } from 'react';
import { Alert } from './alert';
import { MatomoLink } from 'shared/components';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { ReactComponent as Arrow } from 'assets/icons/arrow-right.svg';

export const AlertRequestToExit: FC = () => (
  <Alert title="You have an Exit request">
    <p>
      Your validator has been requested to exit by the Lido protocol. You need
      to exit the validator from the CL as soon as possible to avoid the penalty
      measures
    </p>
    <MatomoLink
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.howToExitAlertLink}
      href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/exiting-csm-validators"
    >
      How to exit?
      <Arrow />
    </MatomoLink>
  </Alert>
);
