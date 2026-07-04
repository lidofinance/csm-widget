import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';

export const Introduction: FC = () => {
  return (
    <Stack direction="column" gap="md">
      <Text as="h3" size="lg" weight="bold">
        Introduction
      </Text>
      <Text size="xs" color="secondary">
        Identified DVT Clusters (IDVTC) is designed for DVT Clusters and creates
        a more capital-efficient path for independent stakers who are willing to
        identify themselves and operate validators collaboratively via DVT. This
        approach combines the trust properties of ICS with the operational
        resilience of DVT, aligning incentives for small independent operators
        who share validator rewards within a cluster.
      </Text>
    </Stack>
  );
};
