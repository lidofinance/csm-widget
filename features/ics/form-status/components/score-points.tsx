import { Text } from '@lidofinance/lido-ui';
import { Points } from 'features/ics/score-system/points';
import {
  IcsResponseDto,
  SCORE_SOURCES,
  TOTAL_SCORE_REQUIRED,
} from 'features/ics/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { calculateScores, isMinScoresReached } from '../utils';
import { ScoreCategory } from './score-category';
import { FailIcon, SemiFailIcon, SuccessIcon } from '../styles';

type ScoreCategoryProps = Pick<IcsResponseDto, 'scores' | 'status'>;

export const ScorePoints: FC<ScoreCategoryProps> = ({ scores, status }) => {
  const isMinReached = isMinScoresReached(scores);
  const total = calculateScores(scores);
  const isEnougth = total >= TOTAL_SCORE_REQUIRED;
  const showIcons = status !== 'APPROVED';
  return (
    <Stack direction="column" gap="md">
      <Stack justify="space-between">
        <Text size="sm" weight={700}>
          {showIcons &&
            (isEnougth ? (
              isMinReached ? (
                <SuccessIcon />
              ) : (
                <SemiFailIcon />
              )
            ) : (
              <FailIcon />
            ))}{' '}
          Total Score Breakdown
        </Text>
        <Text size="sm" weight={700}>
          <Points value={total} />
        </Text>
      </Stack>
      {SCORE_SOURCES.map((category) => (
        <ScoreCategory
          key={category.id}
          category={category}
          scores={scores}
          status={status}
        />
      ))}
    </Stack>
  );
};
