import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ScoreCategory } from './score-category';
import { SCORE_SOURCES } from './score-data';

export const ScoreSources: FC = () => {
  return (
    <Stack direction="column" gap="md">
      <Text as="h2" size="lg" weight="bold">
        Score sources
      </Text>
      <Text size="xs" color="secondary">
        To be included in the list, applicants must obtain a sufficient score in
        each category below as well as an overall score across all the
        categories.
      </Text>
      <Stack justify="space-between">
        <Text size="sm" weight={700}>
          Total score required
        </Text>
        <Text size="sm" weight={700}>
          15 points
        </Text>
      </Stack>
      {SCORE_SOURCES.map((category) => (
        <ScoreCategory key={category.id} category={category} />
      ))}
    </Stack>
  );
};
