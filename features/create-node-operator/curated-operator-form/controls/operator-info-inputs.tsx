import { Text } from '@lidofinance/lido-ui';
import { type FC } from 'react';
import { Stack } from 'shared/components';
import { TextInputHookForm } from 'shared/hook-form/controls';
const MAX_LENGTH = 64;

export const OperatorInfoInputs: FC = () => {
  return (
    <Stack direction="column" gap="xxl">
      <Stack direction="column" gap="xs">
        <TextInputHookForm
          fieldName="name"
          label="Name"
          rules={{
            required: 'Operator name is required',
            maxLength: {
              value: MAX_LENGTH,
              message: `Must be ${MAX_LENGTH} characters or less`,
            },
          }}
        />
        <Text size="xxs" color="secondary">
          {
            'This name will be publicly visible on-chain. Your operator type will be added automatically (e.g., <NodeOperatorName>_ExtraEffort).'
          }
        </Text>
      </Stack>

      <Stack direction="column" gap="xs">
        <TextInputHookForm
          fieldName="description"
          label="What should others know about your operator?"
          rules={{
            required: 'Description is required',
            maxLength: {
              value: MAX_LENGTH,
              message: `Must be ${MAX_LENGTH} characters or less`,
            },
          }}
        />
        <Text size="xxs" color="secondary">
          A short public blurb about your operator. Great for visibility and
          marketing.
        </Text>
      </Stack>
    </Stack>
  );
};
