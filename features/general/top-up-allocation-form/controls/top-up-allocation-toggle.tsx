import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useFormState } from 'react-hook-form';
import { Stack } from 'shared/components';
import { ToggleHookForm } from 'shared/hook-form/controls';
import { useTopUpAllocationFlow, useTopUpAllocationFormData } from '../context';

export const TopUpAllocationToggle: FC = () => {
  const flow = useTopUpAllocationFlow();
  const { enabled } = useTopUpAllocationFormData(true);
  const { isSubmitting } = useFormState();
  const isLocked = flow.action !== 'disable';

  return (
    <Stack direction="column" gap="lg">
      <Text as="h4" size="md" weight={700}>
        Top-ups
      </Text>
      <Stack direction="column" gap="sm">
        <Stack center gap="ms">
          <ToggleHookForm
            fieldName="enabled"
            submitOnChange
            disabled={isSubmitting || isLocked}
          />
          <Text size="xs" weight={700} color="secondary">
            {enabled
              ? 'Top-up are currently enabled'
              : 'Top-up are currently disabled'}
          </Text>
        </Stack>
        <Text size="xs" color="secondary">
          {enabled
            ? 'Your Node Operator is eligible for receiving top-up deposits'
            : 'Your Node Operator is not eligible for receiving top-up deposits. Only the CMC can enable top-ups.'}
        </Text>
      </Stack>
    </Stack>
  );
};
