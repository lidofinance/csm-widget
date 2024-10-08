import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/components/local-link';
import { Alert } from './alert';

export const AlertLockedBond: FC = () => (
  <Alert title="Your bond is locked">
    <p>
      Bond may be locked in the case of an MEV stealing event reported by a
      dedicated committee. To unlock the bond, the penalty amount, which
      includes the stolen amount and a fixed stealing fine, must be compensated
      on the &quot;Locked bond&quot; tab.
    </p>
    <br />
    <LocalLink
      href={PATH.BOND_UNLOCK}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.unlockBondLinkAlert}
    >
      <Button size="xs" color="secondary">
        Unlock bond
      </Button>
    </LocalLink>
  </Alert>
);
