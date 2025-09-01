import { fromPairs } from 'lodash';
import { SCORE_SOURCES } from '../shared/score-data';
import { IcsScoresDto } from '../shared/types';

const summ = (acc: number, item?: number) => acc + (item ?? 0);

const getScoreCategurySum = (scores: IcsScoresDto) => {
  return fromPairs(
    SCORE_SOURCES.map(({ id, max, items }) => {
      const points = items.map(({ id }) => scores[id]).reduce(summ, 0);
      const value = Math.min(points, max ?? points);
      return [id, value] as const;
    }),
  );
};

export const calculateScores = (
  scores: IcsScoresDto,
  category?: string,
): number => {
  const values = getScoreCategurySum(scores);

  if (!category) {
    return Object.values(values).reduce(summ, 0);
  }

  return values[category] ?? 0;
};

export const isMinScoresReached = (scores: IcsScoresDto) => {
  const values = getScoreCategurySum(scores);
  return SCORE_SOURCES.map(({ id, min }) => (values[id] ?? 0) >= min).every(
    Boolean,
  );
};
