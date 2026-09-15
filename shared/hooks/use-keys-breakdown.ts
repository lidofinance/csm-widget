import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useOperatorKeysWithStatus } from 'modules/web3';
import { selectKeysBreakdown } from 'utils';

export const useKeysBreakdown = (
  id: NodeOperatorId | undefined,
  module?: MODULE_NAME,
) => useOperatorKeysWithStatus(id, selectKeysBreakdown, module);
