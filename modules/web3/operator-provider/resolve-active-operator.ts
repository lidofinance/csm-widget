// import type only: the SDK barrel pulls ESM deps that jest cannot load
import type { CachedOperatorRef, ModuleNodeOperator } from './types';

const matches = (item: ModuleNodeOperator, ref: CachedOperatorRef) =>
  item.nodeOperatorId === ref.id && item.module === ref.module;

const toRef = (operator: ModuleNodeOperator): CachedOperatorRef => ({
  id: operator.nodeOperatorId,
  module: operator.module,
});

export const resolveActiveOperator = (
  list: ModuleNodeOperator[] | undefined,
  cachedRef: CachedOperatorRef | undefined,
  active: ModuleNodeOperator | undefined,
): {
  operator: ModuleNodeOperator | undefined;
  needsSelection: boolean;
} => {
  const fromActive =
    active && list?.find((item) => matches(item, toRef(active)));
  if (fromActive) return { operator: fromActive, needsSelection: false };

  const fromCache = cachedRef && list?.find((item) => matches(item, cachedRef));
  if (fromCache) return { operator: fromCache, needsSelection: false };

  if (list?.length === 1) return { operator: list[0], needsSelection: false };

  return { operator: undefined, needsSelection: !!list?.length };
};
