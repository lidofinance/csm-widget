import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { Alert } from './alert';
import { AlertButton } from './styles';

export const AlertExpiredLockedBond: FC = () => (
  <Alert title="Your locked bond has expired">
    <p>
      The lock period has ended. You can unlock your bond now (no compensation
      required).
    </p>
    <br />
    <LocalLink
      href={PATH.BOND_UNLOCK}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.expiredLockedBondLinkAlert}
    >
      <AlertButton>Unlock bond</AlertButton>
    </LocalLink>
  </Alert>
);
