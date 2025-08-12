import { fromPairs } from 'lodash';
import { SCORE_SOURCES } from '../shared/score-data';
import { IcsScoresCategory, IcsScoresDto } from '../shared/types';

const summ = (acc: number, item: number) => acc + item;

export const calculateScores = (
  scores: IcsScoresDto,
  category?: IcsScoresCategory,
): number => {
  const values = fromPairs(
    Object.entries(scores).map(([id, values]) => {
      const { max } = SCORE_SOURCES.find((s) => s.id === id) || {};
      const count = Object.values(values).reduce(summ, 0);
      const value = Math.min(count, max ?? count);
      return [id, value] as const;
    }),
  );
  if (!category) {
    return Object.values(values).reduce(summ, 0);
  }

  return values[category];
};

type NumberList = Partial<Record<string, number>>;

export const findScoreItem = (scores: IcsScoresDto, id: string) => {
  return Object.values(scores).reduce(
    (res, items) => res || ((items as NumberList)[id] ?? 0),
    0,
  );
};
