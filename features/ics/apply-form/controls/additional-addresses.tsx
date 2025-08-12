import { Button, ButtonIcon, Plus, Text } from '@lidofinance/lido-ui';
import { CategoryItemsWrapper } from 'features/ics/score-system/styles';
import { FC, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  Chip,
  ExternalMatomoLink,
  FormTitle,
  MatomoLink,
  Stack,
} from 'shared/components';
import { VerifiedChip } from 'shared/components/input-address/verified-chip';
import {
  AddressInputHookForm,
  TextInputHookForm,
} from 'shared/hook-form/controls';
import { MAX_ADDITIONAL_ADDRESSES, type ApplyFormInputType } from '../context';

export const AdditionalAddresses: FC = () => {
  const { control } = useFormContext<ApplyFormInputType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalAddresses',
  });

  const handleAddAddress = useCallback(() => {
    if (fields.length < MAX_ADDITIONAL_ADDRESSES) {
      append({ address: '', signature: '', verified: false });
    }
  }, [append, fields.length]);

  const handleRemoveAddress = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const { setValue, getValues } = useFormContext<ApplyFormInputType>();

  const handleVerifyAddress = useCallback(
    (index: number) => {
      const currentAddresses = getValues('additionalAddresses');
      const updatedAddresses = [...currentAddresses];
      updatedAddresses[index] = { ...updatedAddresses[index], verified: true };
      setValue('additionalAddresses', updatedAddresses, {
        shouldValidate: true,
      });
    },
    [setValue, getValues],
  );

  return (
    <Stack direction="column" gap="md">
      <Stack direction="column" gap="xxs">
        <FormTitle chip={<Chip>Optional</Chip>}>Additional Addresses</FormTitle>
        <Text size="xs" color="secondary">
          You can add up to {MAX_ADDITIONAL_ADDRESSES} addresses where your
          achievements are stored. To prove you own each address, sign a message
          via the verification page. For more info see{' '}
          <MatomoLink>the guide</MatomoLink>
        </Text>
      </Stack>

      {fields.map((field, index) => (
        <Stack key={field.id} direction="column" gap="sm">
          <Stack direction="row" justify="space-between" align="center">
            <Text as="h4" size="xs" weight="bold">
              Additional address #{index + 1}
            </Text>
            <Button
              size="xs"
              variant="text"
              color="error"
              onClick={() => handleRemoveAddress(index)}
            >
              Remove
            </Button>
          </Stack>
          {field.verified && field.address ? (
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
                <Text size="xs">
                  Step 1. Insert you Ethereum address and sign the transaction
                  on Etherscan.
                </Text>
                <AddressInputHookForm
                  fieldName={`additionalAddresses.${index}.address`}
                  label={`Additional address #${index + 1}`}
                  placeholder="0x..."
                  rightDecorator={
                    <Button size="xs" variant="translucent">
                      <ExternalMatomoLink>Sign</ExternalMatomoLink>
                    </Button>
                  }
                />
              </Stack>
              <Stack direction="column" gap="sm">
                <Text size="xs">
                  Step 2. Copy the signature and past in the field below.
                </Text>
                <TextInputHookForm
                  fieldName={`additionalAddresses.${index}.signature`}
                  label="Signature"
                  placeholder="0x123..."
                  rightDecorator={
                    <Button
                      size="xs"
                      variant="translucent"
                      onClick={() => handleVerifyAddress(index)}
                    >
                      Verify
                    </Button>
                  }
                />
              </Stack>
            </CategoryItemsWrapper>
          )}
        </Stack>
      ))}

      {fields.length < MAX_ADDITIONAL_ADDRESSES && (
        <ButtonIcon
          icon={<Plus />}
          variant="translucent"
          size="sm"
          // variant="outlined"
          onClick={handleAddAddress}
          fullwidth
        >
          Add new address
        </ButtonIcon>
      )}
    </Stack>
  );
};
