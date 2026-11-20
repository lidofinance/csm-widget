import { Card, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import s from './styles.module.css';

const CHIP_WIDTHS = [90, 110, 130];
const ROWS = [0, 1, 2, 3];

export const KeysSkeleton: FC = () => (
  <Card
    align="stretch"
    padding={0}
    gap={0}
    clip
    dataTestId={{ root: 'viewKeysBlock' }}
  >
    <div data-testid="loader">
      <Stack direction="row" gap={8} className={s.chipsArea}>
        {CHIP_WIDTHS.map((width) => (
          <Skeleton key={width} variant="block" width={width} height={32} />
        ))}
      </Stack>
      <Stack direction="column" gap={20} className={s.row}>
        <Skeleton variant="text" width={120} />
        {ROWS.map((row) => (
          <Skeleton key={row} variant="text" />
        ))}
      </Stack>
    </div>
  </Card>
);
