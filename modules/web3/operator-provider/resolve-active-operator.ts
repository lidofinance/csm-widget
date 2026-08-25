// import type only: the SDK barrel pulls ESM deps that jest cannot load
import type {
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';

export const resolveActiveOperator = (
  list: NodeOperatorShortInfo[] | undefined,
  cachedId: NodeOperatorId | undefined,
  active: NodeOperatorShortInfo | undefined,
): {
  operator: NodeOperatorShortInfo | undefined;
  needsSelection: boolean;
} => {
  const fromActive =
    active &&
    list?.find((item) => item.nodeOperatorId === active.nodeOperatorId);
  if (fromActive) return { operator: fromActive, needsSelection: false };

  const fromCache =
    cachedId !== undefined &&
    list?.find((item) => item.nodeOperatorId === cachedId);
  if (fromCache) return { operator: fromCache, needsSelection: false };

  if (list?.length === 1) return { operator: list[0], needsSelection: false };

  return { operator: undefined, needsSelection: !!list?.length };
};
