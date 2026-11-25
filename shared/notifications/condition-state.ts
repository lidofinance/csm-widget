import type { OperatorRef } from 'modules/web3';
import type { ConditionState, OperatorKey } from './types';

type QueryLike = { isSuccess: boolean };

/** `gate === false` is inactive: disabled queries stay pending forever */
export const toConditionState = ({
  gate = true,
  queries,
  active,
}: {
  gate?: boolean;
  queries: QueryLike[];
  active: () => boolean;
}): ConditionState => {
  if (!gate) return 'inactive';
  if (queries.some((query) => !query.isSuccess)) return 'unknown';
  return active() ? 'active' : 'inactive';
};

export const operatorKeyOf = (operator: OperatorRef): OperatorKey =>
  `${operator.module}-${operator.nodeOperatorId}`;
