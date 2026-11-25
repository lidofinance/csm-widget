import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { trackMatomoEvent } from 'utils';
import type { AlertDefinition } from '../types';

export const normalizeQueueDefinition: AlertDefinition = {
  severity: 'normal',
  title: 'You have unqueued keys',
  Body: () => (
    <>
      You have keys that were not included in the deposit queue. To include them
      in the queue - upload new keys, or normalize the queue.
    </>
  ),
  Actions: ({ onNavigate }) => (
    <Button
      size="small"
      variant="outline"
      href={PATH.KEYS_NORMALIZE}
      onClick={() => {
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.normalizeQueueLinkAlert);
        onNavigate();
      }}
    >
      Normalize queue
    </Button>
  ),
};
