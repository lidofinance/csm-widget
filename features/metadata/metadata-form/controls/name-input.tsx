import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const NameInput: FC = () => {
  return (
    <Stack direction="column" gap="xs">
      <TextInputHookForm
        fieldName="name"
        label="Name"
        placeholder="Enter operator name"
      />
      <Text size="xxs" color="secondary">
        This name will be publicly visible on-chain. You can update it later.
      </Text>
    </Stack>
  );
};
