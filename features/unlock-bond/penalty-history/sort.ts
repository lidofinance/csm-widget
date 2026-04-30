import { SortCriteria, SortFunctions } from 'providers/table-provider';
import { EnrichedPenalty } from './types';

const sortByDate: SortCriteria<EnrichedPenalty> = (item) => [item.timestamp];

const typePriority: Record<EnrichedPenalty['type'], number> = {
  settled: 0,
  compensated: 1,
  cancelled: 2,
  expired: 3,
  reported: 4,
};

const sortByType: SortCriteria<EnrichedPenalty> = (item) => [
  typePriority[item.type],
];

const sortByAdditionalFine: SortCriteria<EnrichedPenalty> = (item) => [
  item.additionalFine,
];

const sortByAmount: SortCriteria<EnrichedPenalty> = (item) => [item.amount];

export const sortFunctions: SortFunctions<EnrichedPenalty> = {
  timestamp: sortByDate,
  typeLabel: sortByType,
  additionalFine: sortByAdditionalFine,
  amount: sortByAmount,
};
