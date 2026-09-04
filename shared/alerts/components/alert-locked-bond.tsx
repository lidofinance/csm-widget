import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { Alert } from './alert';
import { AlertButton } from './styles';

export const AlertLockedBond: FC = () => (
  <Alert title="Your bond is locked">
    <p>
      Penalties have been applied to your Node Operator. If they aren’t covered,
      the corresponding amount of your bond may be burned. See details in the
      Locked Bond tab.
    </p>
    <br />
    <LocalLink
      href={PATH.BOND_UNLOCK}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.unlockBondLinkAlert}
    >
      <AlertButton>Unlock bond</AlertButton>
    </LocalLink>
  </Alert>
);
