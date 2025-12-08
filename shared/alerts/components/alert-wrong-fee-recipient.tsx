import { ReactComponent as Arrow } from 'assets/icons/arrow-right.svg';
import { FEE_RECIPIENT_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, useCallback } from 'react';
import { CopyLink, MatomoLink, Plural, Pubkey } from 'shared/components';
import { trackMatomoEvent } from 'utils';
import { Alert } from './alert';
import { AlertButton } from './styles';

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
    <Alert title="Wrong feeRecipient">
      <p>
        The wrong feeRecipient has been detected as being registered with MEV
        Boost relays for the following validator{' '}
        <Plural value={pubkeys.length} variants={['key', 'keys']} />:
      </p>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
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
            <span>
              ...and {remainingCount} more{' '}
              <Plural value={remainingCount} variants={['key', 'keys']} />
            </span>
          </li>
        )}
      </ul>
      <p>Set the feeRecipient to the Lido EL Rewards Vault</p>
      <MatomoLink
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.feeRecipientDocsLink}
        href={FEE_RECIPIENT_LINK}
      >
        How to change the feeRecipient?
        <Arrow />
      </MatomoLink>
      <br />
      {onClose && (
        <AlertButton onClick={handleDismiss}>
          I&apos;ve changed the feeRecipient
        </AlertButton>
      )}
    </Alert>
  );
};
