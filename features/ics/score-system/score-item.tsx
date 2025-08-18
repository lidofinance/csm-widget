import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ScoreItem as ScoreItemType } from '../shared';
import { Points } from './points';
import { ScoreAccordionstyle } from './styles';

type ScoreItemProps = {
  item: ScoreItemType;
};

export const ScoreItem: FC<ScoreItemProps> = ({ item }) => {
  return (
    <ScoreAccordionstyle
      id={`item-${item.id}`}
      summary={
        <Stack justify="space-between" align="center">
          <Stack align="center" gap="sm">
            {item.icon}
            <Text size="xs">{item.name}</Text>
          </Stack>

          <Text size="xs">
            <Points value={item.points} />
          </Text>
        </Stack>
      }
    >
      <Text size="xs" color="secondary">
        {item.description}
      </Text>
    </ScoreAccordionstyle>
  );
};
