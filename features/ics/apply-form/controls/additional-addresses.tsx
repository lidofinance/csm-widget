import { FC, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Text, Stack } from '@lidofinance/lido-ui';
import { AddressInputHookForm, TextInputHookForm } from 'shared/hook-form/controls';
import type { ApplyFormInputType } from '../context';

export const AdditionalAddresses: FC = () => {
  const { control } = useFormContext<ApplyFormInputType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalAddresses',
  });

  const handleAddAddress = useCallback(() => {
    if (fields.length < 5) {
      append({ address: '', signature: '' });
    }
  }, [append, fields.length]);

  const handleRemoveAddress = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  return (
    <Stack direction="column" spacing="md">
      <Stack direction="column" spacing="xs">
        <Text size="sm" weight="bold">
          Additional Addresses
        </Text>
        <Text size="xs" color="secondary">
          You can add up to 5 addresses where your achievements are stored. To
          prove you own each address, sign a message via the verification page.
        </Text>
      </Stack>

      {fields.map((field, index) => (
        <Stack key={field.id} direction="column" spacing="sm">
          <Stack direction="row" justify="space-between" align="center">
            <Text size="sm" weight="bold">
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

          <AddressInputHookForm
            fieldName={`additionalAddresses.${index}.address`}
            label={`Address ${index + 1}`}
            placeholder="0x..."
          />

          <TextInputHookForm
            fieldName={`additionalAddresses.${index}.signature`}
            label={`Signature ${index + 1}`}
            placeholder="0x..."
          />
        </Stack>
      ))}

      {fields.length < 5 && (
        <Button
          size="sm"
          variant="outlined"
          onClick={handleAddAddress}
          fullwidth
        >
          Add address ({fields.length}/5)
        </Button>
      )}
    </Stack>
  );
};