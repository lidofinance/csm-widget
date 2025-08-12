import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { MatomoLink, Stack } from 'shared/components';

export const Introduction: FC = () => {
  return (
    <Stack direction="column" gap="md">
      <Text as="h2" size="lg" weight="bold">
        Introduction
      </Text>
      <Text size="xs" color="secondary">
        <MatomoLink>The score system</MatomoLink> is designed to introduce a
        pathway for independent stakers to identify themselves and be able to
        get{' '}
        <MatomoLink>the Identified Community staker operator type</MatomoLink>.
        Score acts as the entry gate to the Identified Community Stakers List.
        Points can be earned by providing addresses that contain proofs across
        various categories that represent different aspects of experience,
        engagement, and identity.
      </Text>
    </Stack>
  );
};
