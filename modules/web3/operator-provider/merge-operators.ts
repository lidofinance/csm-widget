import { ModuleNodeOperator } from './types';

export const appendModuleOperator = (
  list: ModuleNodeOperator[],
  value: ModuleNodeOperator,
): ModuleNodeOperator[] => {
  const index = list.findIndex(
    (item) =>
      item.nodeOperatorId === value.nodeOperatorId &&
      item.module === value.module,
  );
  if (index === -1) return [...list, value];
  return list.with(index, value);
};
