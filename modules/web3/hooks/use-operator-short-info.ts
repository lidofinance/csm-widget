import {
  MODULE_NAME,
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDKByModule } from '../web3-provider';
import { KEY_OPERATOR_INFO } from './use-operator-info';

export const useOperatorShortInfo = <TData = NodeOperatorShortInfo>(
  nodeOperatorId: NodeOperatorId | undefined,
  select?: (data: NodeOperatorShortInfo) => TData,
  module?: MODULE_NAME,
) => {
  // No module passed ⇒ no operator yet ⇒ query is disabled (id undefined),
  // so the picked SDK is never used; default to CSM (MVP).
  const targetModule = module ?? MODULE_NAME.CSM;
  const { operator } = useSmSDKByModule(targetModule);

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_INFO,
      'short',
      { nodeOperatorId, module: targetModule },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(nodeOperatorId !== undefined);
      return await operator.getManagementProperties(nodeOperatorId);
    },
    enabled: nodeOperatorId !== undefined,
    select,
  });
};
