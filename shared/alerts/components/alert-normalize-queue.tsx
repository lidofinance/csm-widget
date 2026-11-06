import { Button, Notification } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

export const AlertNomalizeQueue: FC = () => (
  <Notification
    fluid
    title="You have unqueued keys"
    actions={
      <Button
        size="small"
        variant="outline"
        href={PATH.KEYS_NORMALIZE}
        onClick={() =>
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.normalizeQueueLinkAlert)
        }
      >
        Normalize queue
      </Button>
    }
  >
    You have keys that were not included in the deposit queue. To include them
    in the queue - upload new keys, or normalize the queue.
  </Notification>
);
