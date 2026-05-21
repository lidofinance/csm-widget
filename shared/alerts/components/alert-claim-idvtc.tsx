import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { Alert } from './alert';
import { AlertButton } from './styles';

export const AlertClaimIdvtc: FC = () => (
  <Alert title="You have a new operator type to be claimed">
    <p>
      The Identified DVT Cluster type is now available to be claimed for your
      node operator.
    </p>
    <br />
    <LocalLink
      href={PATH.TYPE_DVT_CLAIM}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.claimIdvtcLinkAlert}
    >
      <AlertButton>Go to Claim page</AlertButton>
    </LocalLink>
  </Alert>
);
