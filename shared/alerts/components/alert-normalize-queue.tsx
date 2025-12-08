import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { Alert } from './alert';

export const AlertNomalizeQueue: FC = () => (
  <Alert title="You have unqueued keys">
    <p>
      You have keys that were not included in the deposit queue. To include them
      in the queue - upload new keys, or normalize the queue
    </p>
    <br />
    <LocalLink
      href={PATH.KEYS_NORMALIZE}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.normalizeQueueLinkAlert}
    >
      <Button size="xs" color="secondary">
        Normalize queue
      </Button>
    </LocalLink>
  </Alert>
);
