import { Text } from '@lidofinance/lido-ui';
import { Points } from 'features/ics/score-system/points';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ScoreItem as ScoreItemType } from 'features/ics/shared';

type ScoreItemProps = {
  item: ScoreItemType;
  value: number;
};

export const ScoreItem: FC<ScoreItemProps> = ({ item, value }) => {
  return (
    <Stack justify="space-between" align="center" data-testid="scoreItem">
      <Stack align="center" gap="sm">
        {item.icon}
        <Text size="xs" data-testid="itemName">
          {item.name}
        </Text>
      </Stack>

      <Text size="xs" data-testid="points">
        <Points value={value} />
      </Text>
    </Stack>
  );
};
