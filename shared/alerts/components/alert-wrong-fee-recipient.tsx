import { Button, Notification } from '@lidofinance/lido-app-ui';
import Arrow from 'assets/icons/arrow-right.svg?react';
import { FEE_RECIPIENT_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, useCallback } from 'react';
import { CopyLink, Plural, Pubkey } from 'shared/components';
import { trackMatomoEvent } from 'utils';

type AlertWrongFeeRecipientProps = {
  pubkeys: string[];
  onClose?: () => void;
};

const MAX_DISPLAYED_KEYS = 3;

export const AlertWrongFeeRecipient: FC<AlertWrongFeeRecipientProps> = ({
  pubkeys,
  onClose,
}) => {
  const displayKeys = pubkeys.slice(0, MAX_DISPLAYED_KEYS);
  const remainingCount = pubkeys.length - MAX_DISPLAYED_KEYS;

  const handleDismiss = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.feeRecipientDismissButton);
    onClose?.();
  }, [onClose]);

  return (
    <Notification
      fluid
      title="Wrong feeRecipient"
      actions={
        <>
          <Button
            size="small"
            variant="outline"
            href={FEE_RECIPIENT_LINK}
            iconRight={<Arrow />}
            onClick={() =>
              trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.feeRecipientDocsLink)
            }
          >
            How to change the feeRecipient?
          </Button>
          {onClose && (
            <Button size="small" variant="outline" onClick={handleDismiss}>
              I&apos;ve changed the feeRecipient
            </Button>
          )}
        </>
      }
    >
      <p>
        The wrong feeRecipient has been detected as being registered with MEV
        Boost relays for the following validator{' '}
        <Plural value={pubkeys.length} variants={['key', 'keys']} />:
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {displayKeys.map((pubkey) => (
          <li key={pubkey}>
            <Pubkey
              symbols={6}
              pubkey={pubkey}
              link={<CopyLink text={pubkey} />}
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
    </Notification>
  );
};
