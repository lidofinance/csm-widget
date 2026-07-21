import {
  Button,
  ButtonIcon,
  External,
  Input,
  Text,
} from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC } from 'react';
import { Chip, CopyButton, MatomoLink, Stack } from 'shared/components';
import { SquaredChip } from 'shared/components/status-chip/status-chip';
import { VerifiedIcon } from 'shared/components/input-address/styles';
import { isAddress } from 'viem';
import { useOperatorKey } from 'modules/surveys-sdk';
import { generateMemberOwnershipMessage } from '../utils/ownership';

type SignOwnershipFieldsProps = {
  title: string;
  address: string;
  signature: string;
  verified?: boolean;
  isVerifying: boolean;
  discordHandle?: string;
  telegramUsername?: string;
  disableAddress?: boolean;
  onAddressChange: (value: string) => void;
  onSignatureChange: (value: string) => void;
  onDiscordChange: (value: string) => void;
  onTelegramChange: (value: string) => void;
  onVerify: () => void;
  signatureError?: string;
};

export const SignOwnershipFields: FC<SignOwnershipFieldsProps> = ({
  title,
  address,
  signature,
  verified,
  isVerifying,
  discordHandle,
  telegramUsername,
  disableAddress,
  onAddressChange,
  onSignatureChange,
  onDiscordChange,
  onTelegramChange,
  onVerify,
  signatureError,
}) => {
  const op = useOperatorKey();
  const message =
    op && isAddress(address) ? generateMemberOwnershipMessage(address, op) : '';

  return (
    <Stack direction="column" gap="sm">
      <Stack align="center" gap="sm">
        <Text as="h4" size="xs" weight="bold">
          {title}
        </Text>
        {verified ? (
          <SquaredChip variant="primary">
            Verified
            <VerifiedIcon color="primary" />
          </SquaredChip>
        ) : (
          <SquaredChip variant="secondary">Unverified</SquaredChip>
        )}
      </Stack>

      {!verified && (
        <>
          <Stack direction="column" gap="sm" data-testid="signStep1">
            <Text size="xs">
              Step 1. Insert the member Ethereum address and send the link to
              this member to sign the message on Etherscan.
            </Text>
            <Input
              label={title}
              placeholder="0x..."
              value={address}
              disabled={disableAddress}
              onChange={(e) => onAddressChange(e.currentTarget.value)}
            />
            <Input
              value={message}
              readOnly
              label="Message to sign"
              placeholder="Enter address above to generate message..."
              rightDecorator={
                <Stack gap="sm">
                  <CopyButton text={message} size="xs" variant="translucent" />
                  <MatomoLink
                    href="https://etherscan.io/verifiedSignatures#"
                    matomoEvent={
                      MATOMO_CLICK_EVENTS_TYPES.idvtcEtherscanSignaturesLink
                    }
                  >
                    <ButtonIcon
                      data-testid="signBtn"
                      icon={<External />}
                      size="xs"
                      variant="translucent"
                    >
                      Sign
                    </ButtonIcon>
                  </MatomoLink>
                </Stack>
              }
            />
          </Stack>

          <Stack direction="column" gap="sm" data-testid="signStep2">
            <Text size="xs">
              Step 2. Copy the signature and paste it in the field below.
            </Text>
            <Input
              label="Signature"
              placeholder="0x123..."
              value={signature}
              error={signatureError}
              onChange={(e) => onSignatureChange(e.currentTarget.value)}
              rightDecorator={
                <Button
                  size="xs"
                  variant="translucent"
                  onClick={onVerify}
                  disabled={isVerifying}
                  data-testid="verifySignatureBtn"
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </Button>
              }
            />
          </Stack>
        </>
      )}

      <Stack direction="column" gap="xs">
        <Stack center gap="sm">
          <Text size="xs">Add contacts</Text>
          <Chip>Optional</Chip>
        </Stack>
        <Stack direction="row" gap="sm">
          <Input
            label="Discord handle"
            fullwidth
            value={discordHandle ?? ''}
            onChange={(e) => onDiscordChange(e.currentTarget.value)}
          />
          <Input
            label="Telegram username"
            fullwidth
            value={telegramUsername ?? ''}
            onChange={(e) => onTelegramChange(e.currentTarget.value)}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
