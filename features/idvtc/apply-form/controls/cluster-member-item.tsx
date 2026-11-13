import {
  Body,
  Description,
  IconLink,
  Stack,
  Tag,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC, useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { MemberCardStyle } from '../../form-status/styles';
import {
  AddressField,
  CopyField,
  TextField,
  stopFocus,
} from 'shared/hook-form/fields';
import { VALIDATION_MESSAGES } from 'shared/hook-form/validation';
import { VerifiedTag } from 'shared/node-operator/type-status';
import { trackMatomoEvent } from 'utils';
import { isAddress, isHex } from 'viem';
import {
  useClusterMemberMessage,
  useVerifyMessage,
  type IdvtcApplyFormInputType,
} from '../context';
import { OptionalHeading } from './optional-heading';

const ETHERSCAN_SIGNATURES_URL = 'https://etherscan.io/verifiedSignatures#';

const openEtherscan = () => {
  trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.idvtcEtherscanSignaturesLink);
  window.open(ETHERSCAN_SIGNATURES_URL, '_blank', 'noopener,noreferrer');
};

type ClusterMemberItemProps = {
  index: number;
};

export const ClusterMemberItem: FC<ClusterMemberItemProps> = ({ index }) => {
  const watchedAddress = useWatch<IdvtcApplyFormInputType>({
    name: `clusterMembers.${index}.address` as const,
  }) as string;

  const verified = useWatch<IdvtcApplyFormInputType>({
    name: `clusterMembers.${index}.verified` as const,
  });

  const { getValues, setError, clearErrors, setValue, trigger } =
    useFormContext<IdvtcApplyFormInputType>();

  const message = useClusterMemberMessage(watchedAddress);

  const [isVerifying, setIsVerifying] = useState(false);

  const verifyMessage = useVerifyMessage();

  const onVerify = useCallback(async () => {
    if (isVerifying || verified) return;

    const { address, signature } = getValues(`clusterMembers.${index}`);

    if (!isAddress(address)) {
      setError(`clusterMembers.${index}.address`, {
        type: 'manual',
        message: VALIDATION_MESSAGES.invalidAddress,
      });
      return;
    }

    if (!isHex(signature)) {
      setError(`clusterMembers.${index}.signature`, {
        type: 'manual',
        message: 'Invalid signature format',
      });
      return;
    }

    setIsVerifying(true);

    try {
      const isAddressValid = await trigger(`clusterMembers.${index}.address`);
      if (!isAddressValid) return;

      const isValid = await verifyMessage({ address, signature });

      if (isValid) {
        clearErrors(`clusterMembers.${index}.signature`);
        setValue(`clusterMembers.${index}.verified`, true);
      } else {
        setError(`clusterMembers.${index}.signature`, {
          type: 'manual',
          message: 'Invalid signature for this address and message',
        });
      }
    } catch (_error) {
      setError(`clusterMembers.${index}.signature`, {
        type: 'manual',
        message: 'Invalid signature format or verification failed',
      });
    } finally {
      setIsVerifying(false);
    }
  }, [
    clearErrors,
    getValues,
    index,
    setError,
    trigger,
    verifyMessage,
    isVerifying,
    verified,
    setValue,
  ]);

  const onClear = useCallback(() => {
    setValue(`clusterMembers.${index}.address`, '');
    setValue(`clusterMembers.${index}.signature`, '');
    setValue(`clusterMembers.${index}.verified`, false);
  }, [index, setValue]);

  return (
    <MemberCardStyle data-testid={`clusterMember-${index}`}>
      <Stack gap={16}>
        <Stack direction="row" align="center" gap={8}>
          <Body weight="semibold">Cluster member #{index + 1}</Body>
          {verified ? (
            <VerifiedTag />
          ) : (
            <Tag variant="neutral" dataTestId={{ root: 'unverifiedChip' }}>
              Unverified
            </Tag>
          )}
        </Stack>

        {verified ? (
          <AddressField
            name={`clusterMembers.${index}.address`}
            disabled
            simple
            trailing={
              <Tag
                variant="error"
                onClick={stopFocus(onClear)}
                dataTestId={{ root: 'clearBtn' }}
              >
                Clear
              </Tag>
            }
          />
        ) : (
          <>
            <Stack gap={8} data-testid="clusterMemberStep1">
              <Description color="secondary">
                Step 1. Insert cluster member #{index + 1} Ethereum address and
                send the link to this member to sign the transaction on
                Etherscan
              </Description>
              <AddressField
                name={`clusterMembers.${index}.address`}
                placeholder="Cluster member address"
                simple
              />
              <CopyField
                name={`clusterMembers.${index}.messageToSign`}
                label="Message to sign"
                text={message}
                placeholder="Enter address above to generate message..."
                extra={
                  <Tag
                    variant="action"
                    icon={<IconLink />}
                    onClick={stopFocus(openEtherscan)}
                    dataTestId={{ root: 'signBtn' }}
                  >
                    Sign
                  </Tag>
                }
              />
            </Stack>

            <Stack gap={8} data-testid="clusterMemberStep2">
              <Description color="secondary">
                Step 2. Copy the signature and paste in the field below
              </Description>
              <TextField
                name={`clusterMembers.${index}.signature`}
                aria-label="Signature"
                placeholder="Signature"
                trailing={
                  <Tag
                    variant="action"
                    disabled={isVerifying}
                    onClick={stopFocus(() => void onVerify())}
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
          <OptionalHeading>Add contacts</OptionalHeading>
          <Stack direction={{ base: 'row', sm: 'column' }} gap={12}>
            <TextField
              name={`clusterMembers.${index}.discordHandle`}
              label="Discord handle"
              placeholder="Discord handle"
            />
            <TextField
              name={`clusterMembers.${index}.telegramUsername`}
              label="Telegram username"
              placeholder="Telegram username"
            />
          </Stack>
        </Stack>
      </Stack>
    </MemberCardStyle>
  );
};
