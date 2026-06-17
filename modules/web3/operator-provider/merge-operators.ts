import { MODULE_NAME, NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';

import { ModuleNodeOperator } from './types';

const tag =
  (module: MODULE_NAME) =>
  (operator: NodeOperatorShortInfo): ModuleNodeOperator => ({
    ...operator,
    module,
  });

export const mergeOperators = (
  csmOperators: NodeOperatorShortInfo[],
  cmOperators: NodeOperatorShortInfo[],
): ModuleNodeOperator[] => [
  ...csmOperators.map(tag(MODULE_NAME.CSM)),
  ...cmOperators.map(tag(MODULE_NAME.CM)),
];
