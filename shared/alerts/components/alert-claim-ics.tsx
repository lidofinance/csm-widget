import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { Alert } from './alert';
import { AlertButton } from './styles';

export const AlertClaimIcs: FC = () => (
  <Alert title="You have a new operator type to be claimed">
    <p>
      The Identified Community Staker type is now available to be claimed for
      your node operator.
    </p>
    <br />
    <LocalLink
      href={PATH.TYPE_CLAIM}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.claimIcsLinkAlert}
    >
      <AlertButton>Go to Claim page</AlertButton>
    </LocalLink>
  </Alert>
);
