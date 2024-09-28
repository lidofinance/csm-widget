import { FC } from 'react';
import { Alert } from './alert';
import { MatomoLink } from 'shared/components';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { ReactComponent as Arrow } from 'assets/icons/arrow-right.svg';

export const AlertStuckKeys: FC = () => (
  <Alert title="You have Stuck keys">
    <p>
      Your validator was marked as “stuck” because it has not been exited timely
      after the exit request by the protocol. All your keys are excluded from
      the deposit queue and you don’t receive rewards while having a stuck key.
      To avoid the continuation of the restrictive measures you should exit all
      the stuck validators from CL
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
