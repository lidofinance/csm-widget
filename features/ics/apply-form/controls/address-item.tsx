import {
  Button,
  ButtonIcon,
  External,
  Input,
  Text,
} from '@lidofinance/lido-ui';
import { isAddress, isHexString } from 'ethers/lib/utils.js';
import { CategoryItemsWrapper } from 'features/ics/score-system/styles';
import { FC, useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CopyButton2, MatomoLink, Stack } from 'shared/components';
import { VerifiedChip } from 'shared/components/input-address/verified-chip';
import {
  AddressInputHookForm,
  TextInputHookForm,
} from 'shared/hook-form/controls';
import {
  useAddressMessage,
  useVefiryMessage,
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

  const { getValues, setError, clearErrors } =
    useFormContext<ApplyFormInputType>();

  const message = useAddressMessage(watchedAddress);

  const [verified, setVerified] = useState(false);

  const verifyMessage = useVefiryMessage();

  const onVerify = useCallback(
    async (index: number) => {
      const currentAddresses = getValues('additionalAddresses');
      const { address, signature } = currentAddresses[index];

      if (!isHexString(signature)) {
        setError(`additionalAddresses.${index}.signature`, {
          type: 'manual',
          message: 'Invalid signature format',
        });
        return;
      }

      // Check if address is valid
      if (!isAddress(address)) {
        setError(`additionalAddresses.${index}.address`, {
          type: 'manual',
          message: 'Invalid Ethereum address',
        });
        return;
      }

      try {
        const isValid = await verifyMessage({ address, signature });

        if (isValid) {
          clearErrors(`additionalAddresses.${index}.signature`);
          setVerified(true);
        } else {
          // Signature is invalid
          setError(`additionalAddresses.${index}.signature`, {
            type: 'manual',
            message: 'Invalid signature for this address and message',
          });
        }
      } catch (error) {
        // Error during verification (e.g., malformed signature)
        setError(`additionalAddresses.${index}.signature`, {
          type: 'manual',
          message: 'Invalid signature format or verification failed',
        });
      }
    },
    [clearErrors, getValues, setError, verifyMessage],
  );

  return (
    <Stack key={field.id} direction="column" gap="sm">
      <Stack direction="row" justify="space-between" align="center">
        <Text as="h4" size="xs" weight="bold">
          Additional address #{index + 1}
        </Text>
        <Button
          size="xs"
          variant="text"
          color="error"
          onClick={() => onRemove(index)}
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
          <Stack direction="column" gap="sm">
            <Text size="xs">Step 1. Insert you Ethereum address</Text>
            <AddressInputHookForm
              fieldName={`additionalAddresses.${index}.address`}
              label={`Additional address #${index + 1}`}
              placeholder="0x..."
            />
          </Stack>
          <Stack direction="column" gap="sm">
            <Text size="xs">
              Step 2. Copy the message and sign it on Etherscan (or other tool)
            </Text>
            <Input
              value={message}
              readOnly
              label="Message to sign"
              placeholder="Enter address above to generate message..."
              rightDecorator={
                <Stack gap="sm">
                  <CopyButton2 text={message} size="xs" variant="translucent" />
                  <MatomoLink href="https://etherscan.io/verifiedSignatures#">
                    <ButtonIcon
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
          <Stack direction="column" gap="sm">
            <Text size="xs">
              Step 3. Paste the signature in the field below
            </Text>
            <TextInputHookForm
              fieldName={`additionalAddresses.${index}.signature`}
              label="Signature"
              placeholder="0x123..."
              // error="123"
              rightDecorator={
                <Button
                  size="xs"
                  variant="translucent"
                  onClick={() => void onVerify(index)}
                >
                  Verify
                </Button>
              }
            />
          </Stack>
        </CategoryItemsWrapper>
      )}
    </Stack>
  );
};
