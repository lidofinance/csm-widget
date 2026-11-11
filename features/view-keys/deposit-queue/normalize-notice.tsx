import { Button, MessageBox } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

export const NormalizeNotice: FC = () => (
  <MessageBox variant="warning" headline="You have unqueued keys">
    You have keys that were not included in the deposit queue. To include them
    in the queue - upload new keys, or normalize the queue.
    <div>
      <Button
        size="small"
        variant="outline"
        href={PATH.KEYS_NORMALIZE}
        onClick={() =>
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.normalizeQueueLinkKeys)
        }
      >
        Normalize queue
      </Button>
    </div>
  </MessageBox>
);
