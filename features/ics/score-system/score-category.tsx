import { Divider, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ScoreSource } from '../shared';
import { Points } from './points';
import { ScoreItem } from './score-item';
import { ScoreAccordionstyle, CategoryItemsWrapper } from './styles';

type ScoreCategoryProps = {
  category: ScoreSource;
};

export const ScoreCategory: FC<ScoreCategoryProps> = ({ category }) => {
  const categoryHeader = (
    <Stack justify="space-between" align="center">
      <Text size="xs" weight="bold">
        {category.title}
      </Text>
      <Stack gap="sm" align="center">
        <Text size="xs">
          Min: <Points value={category.min} />
        </Text>
        <Divider type="vertical" />
        <Text size="xs">
          Max: <Points value={category.max} />
        </Text>
      </Stack>
    </Stack>
  );

  return (
    <ScoreAccordionstyle id={category.id} summary={categoryHeader}>
      <Stack direction="column" gap="sm">
        <Text size="xs" color="secondary">
          {category.description}
        </Text>
        <CategoryItemsWrapper>
          {category.items.map((item) => (
            <ScoreItem key={item.id} item={item} />
          ))}
        </CategoryItemsWrapper>
      </Stack>
    </ScoreAccordionstyle>
  );
};
