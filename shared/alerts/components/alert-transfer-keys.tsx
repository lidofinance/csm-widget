import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { Alert } from './alert';

export const AlertTransferKeys: FC = () => (
  <Alert title="You have keys available to be transferred to priority queue">
    <p>
      Some of your keys are available to be moved from the legacy queue to the
      priority queue to get priority to get deposited to
    </p>
    <br />
    <LocalLink
      href={PATH.KEYS_TRANSFER}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.transferKeysLinkAlert}
    >
      <Button size="xs" color="secondary">
        Go to Transfer keys tab
      </Button>
    </LocalLink>
  </Alert>
);
