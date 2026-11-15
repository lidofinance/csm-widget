import { Card, Grid, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

export const GroupSectionSkeleton: FC = () => (
  <Stack direction="column" gap={16} role="status" aria-busy="true">
    <Skeleton variant="text" style={{ width: 240 }} />
    <Stack direction="column" gap={8}>
      <Card align="stretch">
        <Skeleton variant="block" style={{ height: 96 }} />
      </Card>
      <Grid columns={{ base: 2, mdDown: 1 }} gap={8}>
        <Card align="stretch">
          <Skeleton variant="block" style={{ height: 240 }} />
        </Card>
        <Card align="stretch">
          <Skeleton variant="block" style={{ height: 240 }} />
        </Card>
      </Grid>
    </Stack>
  </Stack>
);
