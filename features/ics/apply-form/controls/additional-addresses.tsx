import { ButtonIcon, Plus, Text } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MatomoLink, Stack } from 'shared/components';
import { MAX_ADDITIONAL_ADDRESSES, type ApplyFormInputType } from '../context';
import { AddressItem } from './address-item';
import { Chip, FormTitle } from '../components';

export const AdditionalAddresses: FC = () => {
  const { control } = useFormContext<ApplyFormInputType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalAddresses',
  });

  const handleAddAddress = useCallback(() => {
    if (fields.length < MAX_ADDITIONAL_ADDRESSES) {
      append({ address: '', signature: '' });
    }
  }, [append, fields.length]);

  const handleRemoveAddress = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  return (
    <Stack direction="column" gap="md">
      <Stack direction="column" gap="xxs">
        <FormTitle chip={<Chip>Optional</Chip>}>Additional Addresses</FormTitle>
        <Text size="xs" color="secondary">
          You can add up to {MAX_ADDITIONAL_ADDRESSES} addresses where your
          achievements are stored. To prove you own each address, sign a message
          on Etherscan. For more info see{' '}
          <MatomoLink href="https://www.youtube.com/watch?v=yUX34iCbCWE">
            the guide
          </MatomoLink>
        </Text>
      </Stack>

      {fields.map((field, index) => (
        <AddressItem
          key={field.id}
          field={field}
          index={index}
          onRemove={handleRemoveAddress}
        />
      ))}

      {fields.length < MAX_ADDITIONAL_ADDRESSES && (
        <ButtonIcon
          icon={<Plus />}
          variant="translucent"
          size="sm"
          onClick={handleAddAddress}
          fullwidth
        >
          Add new address
        </ButtonIcon>
      )}
    </Stack>
  );
};
