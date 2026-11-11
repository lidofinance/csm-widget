import { Button, Copy, Notification } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { Pubkey } from 'shared/components';
import { notifyCopied } from 'shared/hooks';
import { formatDate, trackMatomoEvent } from 'utils';

type AlertKeyStrikeProps = {
  pubkeys: string[];
  start: number;
  end: number;
  onDismiss: () => void;
};

export const AlertKeyStrike: FC<AlertKeyStrikeProps> = ({
  pubkeys,
  start,
  end,
  onDismiss,
}) => (
  <Notification
    fluid
    title="Your key got a strike"
    actions={
      <>
        <Button
          size="small"
          href={`${PATH.KEYS}?status=withStrikes`}
          onClick={() =>
            trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.keyStrikeViewStrikes)
          }
        >
          View strikes
        </Button>
        <Button
          size="small"
          variant="outline"
          onClick={() => {
            trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.keyStrikeDismiss);
            onDismiss();
          }}
        >
          Dismiss
        </Button>
      </>
    }
  >
    <p>
      The following keys got strikes for low performance during the latest
      monitoring frame{' '}
      <span style={{ whiteSpace: 'nowrap' }}>
        ({formatDate(start, 'MMM d')} — {formatDate(end, 'MMM d')})
      </span>
      :
    </p>
    <ul style={{ margin: 0, paddingLeft: 21 }}>
      {pubkeys.map((pubkey) => (
        <li key={pubkey}>
          <Pubkey
            symbols={6}
            pubkey={pubkey}
            link={<Copy text={pubkey} onCopy={notifyCopied} />}
          />
        </li>
      ))}
    </ul>
  </Notification>
);
