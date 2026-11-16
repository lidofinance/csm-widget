import { Grid, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { StretchCard } from 'shared/components';

export const MyOperatorsSkeleton: FC = () => (
  <Stack direction="column" gap={16} role="status" aria-busy="true">
    <Skeleton variant="text" style={{ width: 240 }} />
    <Grid columns={{ base: 2, mdDown: 1 }} gap={8}>
      <StretchCard>
        <Skeleton variant="block" style={{ height: 240 }} />
      </StretchCard>
      <StretchCard>
        <Skeleton variant="block" style={{ height: 240 }} />
      </StretchCard>
    </Grid>
  </Stack>
);
