import { Button, Copy } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Pubkey } from 'shared/components';
import { notifyCopied } from 'shared/hooks';
import { formatDate, trackMatomoEvent } from 'utils';
import type { AlertDefinition } from '../types';

export type KeyStrikeProps = {
  pubkeys: string[];
  start: number;
  end: number;
  nextReport: number;
};

export const keyStrikeDefinition: AlertDefinition<KeyStrikeProps> = {
  severity: 'important',
  title: 'Your key got a strike',
  ackUntil: (props) => props.nextReport * 1000,
  onDismissTrack: () =>
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.keyStrikeDismiss),
  Body: ({ pubkeys, start, end }) => (
    <>
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
    </>
  ),
  Actions: ({ onNavigate }) => (
    <Button
      size="small"
      href={`${PATH.KEYS}?status=withStrikes`}
      onClick={() => {
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.keyStrikeViewStrikes);
        onNavigate();
      }}
    >
      View strikes
    </Button>
  ),
};
