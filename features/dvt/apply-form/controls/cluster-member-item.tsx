import {
  Button,
  ButtonIcon,
  External,
  Input,
  Text,
} from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC, useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  Chip,
  CopyButton,
  FormTitle,
  MatomoLink,
  Stack,
} from 'shared/components';
import { VerifiedIcon } from 'shared/components/input-address/styles';
import { SquaredChip } from 'shared/components/status-chip/status-chip';
import {
  AddressInputHookForm,
  TextInputHookForm,
} from 'shared/hook-form/controls';
import { isAddress, isHex } from 'viem';
import {
  useClusterMemberMessage,
  useVerifyMessage,
  type DvtApplyFormInputType,
} from '../context';
import { ClusterMemberCard } from '../styles';

type ClusterMemberItemProps = {
  index: number;
};

export const ClusterMemberItem: FC<ClusterMemberItemProps> = ({ index }) => {
  const watchedAddress = useWatch<DvtApplyFormInputType>({
    name: `clusterMembers.${index}.address` as const,
  }) as string;

  const verified = useWatch<DvtApplyFormInputType>({
    name: `clusterMembers.${index}.verified` as const,
  });

  const { getValues, setError, clearErrors, setValue } =
    useFormContext<DvtApplyFormInputType>();

  const message = useClusterMemberMessage(watchedAddress);

  const [isVerifying, setIsVerifying] = useState(false);

  const verifyMessage = useVerifyMessage();

  const onVerify = useCallback(async () => {
    if (isVerifying || verified) return;

    const currentMembers = getValues('clusterMembers');
    const { address, signature } = currentMembers[index];

    if (!isAddress(address)) {
      setError(`clusterMembers.${index}.address`, {
        type: 'manual',
        message: 'Invalid Ethereum address',
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
    <ClusterMemberCard data-testid={`clusterMember-${index}`}>
      <Stack direction="column" gap="sm">
        <Stack align="center" gap="sm">
          <Text as="h4" size="xs" weight="bold">
            Cluster member #{index + 1}
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

        {verified ? (
          <Stack direction="column" gap="sm">
            <AddressInputHookForm
              fieldName={`clusterMembers.${index}.address`}
              label={`Cluster member #${index + 1}`}
              disabled
              rightDecorator={
                <Button
                  size="xs"
                  variant="translucent"
                  color="error"
                  onClick={onClear}
                  data-testid="clearBtn"
                >
                  Clear
                </Button>
              }
            />

            <Stack direction="column" gap="xs">
              <FormTitle chip={<Chip>Optional</Chip>}>Add contacts</FormTitle>
              <Stack direction="row" gap="sm">
                <TextInputHookForm
                  fieldName={`clusterMembers.${index}.discordHandle`}
                  label="Discord handle"
                  fullwidth
                />
                <TextInputHookForm
                  fieldName={`clusterMembers.${index}.telegramUsername`}
                  label="Telegram username"
                  fullwidth
                />
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack direction="column">
            <Stack direction="column" gap="sm" data-testid="clusterMemberStep1">
              <Text size="xs">
                Step 1. Insert cluster member #{index + 1} Ethereum address and
                send the link to this member to sign the transaction on
                Etherscan.
              </Text>
              <AddressInputHookForm
                fieldName={`clusterMembers.${index}.address`}
                label={`Cluster member #${index + 1}`}
                placeholder="0x..."
              />
              <Input
                name={`clusterMembers.${index}.messageToSign`}
                value={message}
                readOnly
                label="Message to sign"
                placeholder="Enter address above to generate message..."
                rightDecorator={
                  <Stack gap="sm">
                    <CopyButton
                      text={message}
                      size="xs"
                      variant="translucent"
                    />
                    <MatomoLink
                      href="https://etherscan.io/verifiedSignatures#"
                      matomoEvent={
                        MATOMO_CLICK_EVENTS_TYPES.dvtEtherscanSignaturesLink
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

            <Stack direction="column" gap="sm" data-testid="clusterMemberStep2">
              <Text size="xs">
                Step 2. Copy the signature and past in the field below
              </Text>
              <TextInputHookForm
                fieldName={`clusterMembers.${index}.signature`}
                label="Signature"
                placeholder="0x123..."
                rightDecorator={
                  <Button
                    size="xs"
                    variant="translucent"
                    onClick={() => void onVerify()}
                    disabled={isVerifying}
                    data-testid="verifySignatureBtn"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Button>
                }
              />
            </Stack>

            <Stack direction="column" gap="xs">
              <Stack center gap="sm">
                <Text size="xs">Add contacts</Text>
                <Chip>Optional</Chip>
              </Stack>
              <Stack direction="row" gap="sm">
                <TextInputHookForm
                  fieldName={`clusterMembers.${index}.discordHandle`}
                  label="Discord handle"
                  fullwidth
                />
                <TextInputHookForm
                  fieldName={`clusterMembers.${index}.telegramUsername`}
                  label="Telegram username"
                  fullwidth
                />
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </ClusterMemberCard>
  );
};
