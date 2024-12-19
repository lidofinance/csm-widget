import { HOW_TO_EXIT_VALIDATOR_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { Alert } from './alert';

import { ReactComponent as Arrow } from 'assets/icons/arrow-right.svg';

export const AlertRequestToExit: FC = () => (
  <Alert title="You have an Exit Request">
    <p>
      Your validator has been requested to exit by the Lido protocol. You need
      to exit the validator from the CL as soon as possible to avoid the penalty
      measures
    </p>
    <MatomoLink
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.howToExitLinkRequestToExitAlert}
      href={HOW_TO_EXIT_VALIDATOR_LINK}
    >
      How to exit?
      <Arrow />
    </MatomoLink>
  </Alert>
);
