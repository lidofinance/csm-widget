import { Text } from '@lidofinance/lido-ui';
import { Points } from 'features/ics/score-system/points';
import {
  CategoryItemsWrapper,
  ScoreAccordionstyle,
} from 'features/ics/score-system/styles';
import { TipWrapper } from 'features/monitoring/attestation-rate-section/styles';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { IcsFormStatus, IcsScoresDto, ScoreSource } from 'features/ics/shared';
import { FailIcon, SuccessIcon } from '../styles';
import { calculateScores } from '../utils';
import { ScoreItem } from './score-item';

type ScoreCategoryProps = {
  category: ScoreSource;
  scores: IcsScoresDto;
  status: IcsFormStatus;
};

export const ScoreCategory: FC<ScoreCategoryProps> = ({
  category,
  scores,
  status,
}) => {
  const value = calculateScores(scores, category.id);
  const isEnougth = value >= category.min;
  const showIcons = status !== 'APPROVED';

  const categoryHeader = (
    <Stack justify="space-between" align="center">
      <Text size="xs" weight="bold">
        {showIcons && (isEnougth ? <SuccessIcon /> : <FailIcon />)}{' '}
        {category.title}
      </Text>
      <Stack gap="sm" align="center">
        <Text size="xs">
          <Points value={value} />
        </Text>
      </Stack>
    </Stack>
  );

  return (
    <ScoreAccordionstyle id={category.id} summary={categoryHeader}>
      <Stack direction="column" gap="sm">
        {!isEnougth && (
          <TipWrapper>
            You did not reach the minimum score of{' '}
            <Points value={category.min} /> required for this category.
          </TipWrapper>
        )}
        <CategoryItemsWrapper>
          {category.items.map((item) => (
            <ScoreItem key={item.id} item={item} value={scores[item.id] ?? 0} />
          ))}
        </CategoryItemsWrapper>
      </Stack>
    </ScoreAccordionstyle>
  );
};
