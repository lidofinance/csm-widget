import {
  Body,
  Button,
  Description,
  IconLink,
  Stack,
  Tag,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useFormContext, useWatch } from 'react-hook-form';
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
  useAddressMessage,
  useVerifyMessage,
  type ApplyFormInputType,
} from '../context';
import { ETHERSCAN_SIGNATURES_URL } from './consts';

const StepsStyle = styled(Stack)`
  padding-left: 16px;
  border-left: 1px solid var(--lido-app-ui-color-border-default);
`;

const openEtherscan = () => {
  trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.icsEtherscanSignaturesLink);
  window.open(ETHERSCAN_SIGNATURES_URL, '_blank', 'noopener,noreferrer');
};

export type AddressItemProps = {
  index: number;
  onRemove: (index: number) => void;
};

export const AddressItem: FC<AddressItemProps> = ({ index, onRemove }) => {
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
          message: VALIDATION_MESSAGES.invalidAddress,
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
    <Stack gap={12} data-testid={`additionalAddressInfo-${index}`}>
      <Stack direction="row" justify="between" align="center">
        <Body weight="semibold">Additional address #{index + 1}</Body>
        <Button
          type="button"
          size="small"
          variant="error"
          onClick={() => onRemove(index)}
          dataTestId={{ root: 'removeBtn' }}
        >
          Remove
        </Button>
      </Stack>
      {verified ? (
        <AddressField
          name={`additionalAddresses.${index}.address`}
          disabled
          simple
          trailing={<VerifiedTag />}
        />
      ) : (
        <StepsStyle gap={16}>
          <Stack gap={8} data-testid="additionalAddressStep1">
            <Description color="secondary">
              Step 1. Insert your Ethereum address
            </Description>
            <AddressField
              name={`additionalAddresses.${index}.address`}
              placeholder="0x..."
            />
          </Stack>
          <Stack gap={8} data-testid="additionalAddressStep2">
            <Description color="secondary">
              Step 2. Copy the message and sign it on Etherscan (or other tool)
            </Description>
            <CopyField
              name={`additionalAddresses.${index}.messageToSign`}
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
          <Stack gap={8} data-testid="additionalAddressStep3">
            <Description color="secondary">
              Step 3. Paste the signature in the field below
            </Description>
            <TextField
              name={`additionalAddresses.${index}.signature`}
              aria-label="Signature"
              placeholder="Signature"
              trailing={
                <Tag
                  variant="action"
                  disabled={isVerifying}
                  onClick={stopFocus(() => void onVerify(index))}
                  dataTestId={{ root: 'verifySignatureBtn' }}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </Tag>
              }
            />
          </Stack>
        </StepsStyle>
      )}
    </Stack>
  );
};
