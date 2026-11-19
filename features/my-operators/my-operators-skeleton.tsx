import { Card, Grid, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

export const MyOperatorsSkeleton: FC = () => (
  <Stack direction="column" gap={16} role="status" aria-busy="true">
    <Skeleton variant="text" width={240} />
    <Grid columns={{ base: 2, mdDown: 1 }} gap={8}>
      <Card align="stretch">
        <Skeleton variant="block" height={240} />
      </Card>
      <Card align="stretch">
        <Skeleton variant="block" height={240} />
      </Card>
    </Grid>
  </Stack>
);
