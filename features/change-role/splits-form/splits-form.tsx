import { Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC, memo } from 'react';
import { BackButton, FormBlock } from 'shared/components';

export const SplitsForm: FC = memo(() => {
  return (
    <FormBlock data-testid="splitsForm">
      <BackButton text="Back to all roles" href={PATH.ROLES} />
      <Text size="md" weight={700} as="h4">
        Rewards splitter
      </Text>
      <Text size="xs" color="secondary">
        Coming soon
      </Text>
    </FormBlock>
  );
});
