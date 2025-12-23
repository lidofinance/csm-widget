import {
  Button,
  ButtonIcon,
  External,
  Input,
  Text,
} from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { CategoryItemsWrapper } from 'features/ics/score-system/styles';
import { FC, useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CopyButton, MatomoLink, Stack } from 'shared/components';
import { VerifiedChip } from 'shared/components/input-address/verified-chip';
import {
  AddressInputHookForm,
  TextInputHookForm,
} from 'shared/hook-form/controls';
import { isAddress, isHex } from 'viem';
import {
  useAddressMessage,
  useVerifyMessage,
  type ApplyFormInputType,
} from '../context';

export type AddressItemProps = {
  field: { id: string; address: string; signature: string; verified?: boolean };
  index: number;
  onRemove: (index: number) => void;
};

export const AddressItem: FC<AddressItemProps> = ({
  field,
  index,
  onRemove,
}) => {
  const watchedAddress = useWatch<ApplyFormInputType>({
    name: `additionalAddresses.${index}.address` as const,
  }) as string;

  const verified = useWatch<ApplyFormInputType>({
    name: `additionalAddresses.${index}.verified` as const,
  });

  const { getValues, setError, clearErrors, setValue } =
    useFormContext<ApplyFormInputType>();

  const message = useAddressMessage(watchedAddress);

  const [isVerifying, setIsVerifying] = useState(false);

  const verifyMessage = useVerifyMessage();

  const onVerify = useCallback(
    async (index: number) => {
      if (isVerifying || verified) return;

      const currentAddresses = getValues('additionalAddresses');
      const { address, signature } = currentAddresses[index];

      if (!isHex(signature)) {
        setError(`additionalAddresses.${index}.signature`, {
          type: 'manual',
          message: 'Invalid signature format',
        });
        return;
      }

      if (!isAddress(address)) {
        setError(`additionalAddresses.${index}.address`, {
          type: 'manual',
          message: 'Invalid Ethereum address',
        });
        return;
      }

      setIsVerifying(true);

      try {
        const isValid = await verifyMessage({ address, signature });

        if (isValid) {
          clearErrors(`additionalAddresses.${index}.signature`);
          setValue(`additionalAddresses.${index}.verified`, true);
        } else {
          setError(`additionalAddresses.${index}.signature`, {
            type: 'manual',
            message: 'Invalid signature for this address and message',
          });
        }
      } catch (error) {
        setError(`additionalAddresses.${index}.signature`, {
          type: 'manual',
          message: 'Invalid signature format or verification failed',
        });
      } finally {
        setIsVerifying(false);
      }
    },
    [
      clearErrors,
      getValues,
      setError,
      verifyMessage,
      isVerifying,
      verified,
      setValue,
    ],
  );

  return (
    <Stack
      key={field.id}
      direction="column"
      gap="sm"
      data-testid={`additionalAddressInfo-${index}`}
    >
      <Stack direction="row" justify="space-between" align="center">
        <Text as="h4" size="xs" weight="bold">
          Additional address #{index + 1}
        </Text>
        <Button
          size="xs"
          variant="text"
          color="error"
          onClick={() => onRemove(index)}
          data-testid="removeBtn"
        >
          Remove
        </Button>
      </Stack>
      {verified ? (
        <Stack direction="column" gap="sm">
          <AddressInputHookForm
            fieldName={`additionalAddresses.${index}.address`}
            disabled
            label={
              <>
                Additional address #{index + 1}{' '}
                <VerifiedChip color="primary">Verified</VerifiedChip>
              </>
            }
          />
        </Stack>
      ) : (
        <CategoryItemsWrapper $gap="md" $offset="md">
          <Stack
            direction="column"
            gap="sm"
            data-testid="additionalAddressStep1"
          >
            <Text size="xs">Step 1. Insert your Ethereum address</Text>
            <AddressInputHookForm
              fieldName={`additionalAddresses.${index}.address`}
              label={`Additional address #${index + 1}`}
              placeholder="0x..."
            />
          </Stack>
          <Stack
            direction="column"
            gap="sm"
            data-testid="additionalAddressStep2"
          >
            <Text size="xs">
              Step 2. Copy the message and sign it on Etherscan (or other tool)
            </Text>
            <Input
              name={`additionalAddresses.${index}.messageToSign`}
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
                      MATOMO_CLICK_EVENTS_TYPES.icsEtherscanSignaturesLink
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
          <Stack
            direction="column"
            gap="sm"
            data-testid="additionalAddressStep3"
          >
            <Text size="xs">
              Step 3. Paste the signature in the field below
            </Text>
            <TextInputHookForm
              fieldName={`additionalAddresses.${index}.signature`}
              label="Signature"
              placeholder="0x123..."
              rightDecorator={
                <Button
                  size="xs"
                  variant="translucent"
                  onClick={() => void onVerify(index)}
                  disabled={isVerifying}
                  data-testid="verifyBtn"
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </Button>
              }
            />
          </Stack>
        </CategoryItemsWrapper>
      )}
    </Stack>
  );
};
