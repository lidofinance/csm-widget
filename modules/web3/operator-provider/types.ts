import type {
  MODULE_NAME,
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';

export type ModuleNodeOperator = NodeOperatorShortInfo & {
  module: MODULE_NAME;
};

export type CachedOperatorRef = {
  id: NodeOperatorId;
  module: MODULE_NAME;
};
