import {
  Body,
  Description,
  IconCheck,
  IconLink,
  IconCopy,
  Input,
  Stack,
  Tag,
  useCopy,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC, MouseEvent } from 'react';
import { StretchStack } from 'shared/components';
import { TrailingInput } from 'shared/hook-form/fields/trailing-input';
import { isAddress } from 'viem';
import { useOperatorKey } from 'modules/surveys-sdk';
import { trackMatomoEvent } from 'utils';
import { generateMemberOwnershipMessage } from '../utils/ownership';

const ETHERSCAN_SIGNATURES_URL = 'https://etherscan.io/verifiedSignatures#';

type SignOwnershipFieldsProps = {
  title: string;
  memberNumber: number;
  address: string;
  signature: string;
  verified?: boolean;
  isVerifying: boolean;
  discordHandle?: string;
  telegramUsername?: string;
  disableAddress?: boolean;
  onClear?: () => void;
  onAddressChange: (value: string) => void;
  onSignatureChange: (value: string) => void;
  onDiscordChange: (value: string) => void;
  onTelegramChange: (value: string) => void;
  onVerify: () => void;
  signatureError?: string;
};

const openEtherscan = () => {
  trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.idvtcEtherscanSignaturesLink);
  window.open(ETHERSCAN_SIGNATURES_URL, '_blank', 'noopener,noreferrer');
};

// tags sit inside the input's label: default click would focus the input
const stop =
  (action: () => void) =>
  (event: MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    action();
  };

export const SignOwnershipFields: FC<SignOwnershipFieldsProps> = ({
  title,
  memberNumber,
  address,
  signature,
  verified,
  isVerifying,
  discordHandle,
  telegramUsername,
  disableAddress,
  onClear,
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
  const { copy } = useCopy(message);

  return (
    <StretchStack gap={16}>
      <Stack direction="row" align="center" gap={8}>
        <Body weight="semibold">{title}</Body>
        {verified ? (
          <Tag variant="success" icon={<IconCheck />}>
            Verified
          </Tag>
        ) : (
          <Tag variant="neutral">Unverified</Tag>
        )}
      </Stack>

      {verified ? (
        <TrailingInput
          aria-label={title}
          value={address}
          readOnly
          trailing={
            onClear && (
              <Tag
                variant="action"
                onClick={stop(onClear)}
                dataTestId={{ root: 'clearMemberBtn' }}
              >
                Clear
              </Tag>
            )
          }
        />
      ) : (
        <>
          <Stack gap={8} data-testid="signStep1">
            <Description color="secondary">
              Step 1. Insert cluster member #{memberNumber} Ethereum address and
              send the link to this member to sign the transaction on Etherscan
            </Description>
            <Input
              aria-label="Cluster member address"
              placeholder="Cluster member address"
              value={address}
              disabled={disableAddress}
              onChange={(e) => onAddressChange(e.currentTarget.value)}
            />
            <TrailingInput
              aria-label="Message to sign"
              value={message}
              readOnly
              placeholder="Message to sign"
              trailing={
                <Stack direction="row" gap={8}>
                  <Tag
                    variant="action"
                    icon={<IconCopy />}
                    onClick={stop(() => void copy())}
                  >
                    Copy
                  </Tag>
                  <Tag
                    variant="action"
                    icon={<IconLink />}
                    onClick={stop(openEtherscan)}
                    dataTestId={{ root: 'signBtn' }}
                  >
                    Sign
                  </Tag>
                </Stack>
              }
            />
          </Stack>

          <Stack gap={8} data-testid="signStep2">
            <Description color="secondary">
              Step 2. Copy the signature and paste in the field below
            </Description>
            <TrailingInput
              aria-label="Signature"
              placeholder="Signature"
              value={signature}
              error={signatureError}
              onChange={(e) => onSignatureChange(e.currentTarget.value)}
              trailing={
                <Tag
                  variant="action"
                  disabled={isVerifying}
                  onClick={stop(onVerify)}
                  dataTestId={{ root: 'verifySignatureBtn' }}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </Tag>
              }
            />
          </Stack>
        </>
      )}

      <Stack gap={8}>
        <Stack direction="row" align="center" gap={8}>
          <Body weight="semibold">Add contacts</Body>
          <Tag variant="neutral">Optional</Tag>
        </Stack>
        <Stack direction={{ base: 'row', sm: 'column' }} gap={12}>
          <Input
            label="Discord handle"
            placeholder="Discord handle"
            value={discordHandle ?? ''}
            onChange={(e) => onDiscordChange(e.currentTarget.value)}
          />
          <Input
            label="Telegram username"
            placeholder="Telegram username"
            value={telegramUsername ?? ''}
            onChange={(e) => onTelegramChange(e.currentTarget.value)}
          />
        </Stack>
      </Stack>
    </StretchStack>
  );
};
