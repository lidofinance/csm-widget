import { FC } from 'react';
import { Alert } from './alert';
import { MatomoLink } from 'shared/components';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { ReactComponent as Arrow } from 'assets/icons/arrow-right.svg';

export const AlertStuckKeys: FC = () => (
  <Alert title="You have Stuck keys">
    <p>
      Your validator has been marked as “stuck” due to a delay in exiting after
      the protocol’s exit request. As a result, all associated keys have been
      excluded from the deposit queue, and no rewards are earned while a key
      remains stuck. To lift these restrictions, please exit all stuck
      validators from the CL promptly
    </p>
    <MatomoLink
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.howToExitLinkStuckKeysAlert}
      href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/exiting-csm-validators"
    >
      How to exit?
      <Arrow />
    </MatomoLink>
  </Alert>
);
