import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useOperatorKeysWithStatus } from 'modules/web3';
import { selectKeysBreakdown } from 'utils';

export const useKeysBreakdown = ({
  nodeOperatorId,
  module,
}: {
  nodeOperatorId: NodeOperatorId | undefined;
  module?: MODULE_NAME;
}) =>
  useOperatorKeysWithStatus({
    nodeOperatorId,
    select: selectKeysBreakdown,
    module,
  });
