import { Button, Copy, IconArrowRight } from '@lidofinance/lido-app-ui';
import { FEE_RECIPIENT_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Plural, Pubkey } from 'shared/components';
import { notifyCopied } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import type { AlertDefinition } from '../types';

export type WrongFeeRecipientProps = { pubkeys: string[] };

const MAX_DISPLAYED_KEYS = 3;
const DISMISS_HOURS = 10;

export const wrongFeeRecipientDefinition: AlertDefinition<WrongFeeRecipientProps> =
  {
    severity: 'important',
    title: 'Wrong feeRecipient',
    ackUntil: (_, now) => now + DISMISS_HOURS * 3600_000,
    dismissLabel: "I've changed the feeRecipient",
    onDismissTrack: () =>
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.feeRecipientDismissButton),
    Body: ({ pubkeys }) => {
      const displayKeys = pubkeys.slice(0, MAX_DISPLAYED_KEYS);
      const remainingCount = pubkeys.length - MAX_DISPLAYED_KEYS;

      return (
        <>
          <p>
            The wrong feeRecipient has been detected as being registered with
            MEV Boost relays for the following validator{' '}
            <Plural value={pubkeys.length} variants={['key', 'keys']} />:
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {displayKeys.map((pubkey) => (
              <li key={pubkey}>
                <Pubkey
                  symbols={6}
                  pubkey={pubkey}
                  link={<Copy text={pubkey} onCopy={notifyCopied} />}
                />
              </li>
            ))}
            {remainingCount > 0 && (
              <li>
                ...and {remainingCount} more{' '}
                <Plural value={remainingCount} variants={['key', 'keys']} />
              </li>
            )}
          </ul>
          <p>Set the feeRecipient to the Lido EL Rewards Vault</p>
        </>
      );
    },
    Actions: ({ onNavigate }) => (
      <Button
        size="small"
        variant="outline"
        href={FEE_RECIPIENT_LINK}
        iconRight={<IconArrowRight />}
        onClick={() => {
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.feeRecipientDocsLink);
          onNavigate();
        }}
      >
        How to change the feeRecipient?
      </Button>
    ),
  };
