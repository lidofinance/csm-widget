import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { MatomoLink, Stack } from 'shared/components';

export const Introduction: FC = () => {
  return (
    <Stack direction="column" gap="md">
      <Text as="h3" size="lg" weight="bold">
        Introduction
      </Text>
      <Text size="xs" color="secondary">
        The scoring system creates a clear path for independent stakers to
        qualify as "Identified Community" operators. Your score determines
        eligibility for the Identified Community Stakers List. Points are
        awarded by submitting verifiable proofs; - across categories such
        as experience, on-chain engagement, and community contributions -
        that demonstrate your qualifications.
      </Text>
    </Stack>
  );
};
