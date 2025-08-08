import { fromPairs } from 'lodash';
import { SCORE_SOURCES } from '../shared/score-data';
import { IcsScoresDto } from '../shared/types';

const summ = (acc: number, item?: number) => acc + (item ?? 0);

export const calculateScores = (
  scores: IcsScoresDto,
  category?: string,
): number => {
  const values = fromPairs(
    SCORE_SOURCES.map(({ id, max, items }) => {
      const points = items.map(({ id }) => scores[id]).reduce(summ, 0);
      const value = Math.min(points, max ?? points);
      return [id, value] as const;
    }),
  );
  if (!category) {
    return Object.values(values).reduce(summ, 0);
  }

  return values[category] ?? 0;
};
