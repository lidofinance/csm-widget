import { MODULE_NAME, NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { ModuleNodeOperator } from './types';

type ModuleOperators = {
  module: MODULE_NAME;
  operators: NodeOperatorShortInfo[];
};

export const mergeOperators = (
  results: ModuleOperators[],
): ModuleNodeOperator[] =>
  results.flatMap(({ module, operators }) =>
    operators.map((operator) => ({ ...operator, module })),
  );

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
