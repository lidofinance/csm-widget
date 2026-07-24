import { OperatorWithLockedBond } from '@lidofinance/lido-csm-sdk';
import { SortCriteria, SortFunctions } from 'providers/table-provider';

const sortByNodeOperatorId: SortCriteria<OperatorWithLockedBond> = (item) => [
  item.nodeOperatorId,
];

const sortByLocked: SortCriteria<OperatorWithLockedBond> = (item) => [
  item.locked,
  item.nodeOperatorId,
];

const sortByUntil: SortCriteria<OperatorWithLockedBond> = (item) => [
  item.until,
  item.nodeOperatorId,
];

export const sortFunctions: SortFunctions<OperatorWithLockedBond> = {
  nodeOperatorId: sortByNodeOperatorId,
  locked: sortByLocked,
  until: sortByUntil,
};
