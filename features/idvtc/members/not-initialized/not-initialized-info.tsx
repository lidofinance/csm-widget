import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormBlock } from 'shared/components';

export const NotInitializedInfo: FC = () => (
  <FormBlock $gap="lg" data-testid="notInitializedInfo">
    <Text size="sm">Members have not been initialized yet</Text>
    <Text size="xs" color="secondary">
      The Manager or Reward Address of this operator needs to initialize the
      cluster members
    </Text>
  </FormBlock>
);
