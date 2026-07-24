import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const DescriptionInput: FC = () => {
  return (
    <Stack direction="column" gap="xs">
      <TextInputHookForm
        fieldName="description"
        label="Description"
        placeholder="Enter operator description"
      />
      <Text size="xxs" color="secondary">
        A short blurb about your operator. This description will be publicly
        visible on-chain and can be updated later.
      </Text>
    </Stack>
  );
};
