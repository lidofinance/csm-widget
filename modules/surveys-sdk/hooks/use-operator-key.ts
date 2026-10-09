import { useModule, useNodeOperatorId } from 'modules/web3';
import type { OperatorKey } from '../api/types';
import { operatorKey } from '../api/url';

export const useOperatorKey = (
  idOverride?: bigint,
): OperatorKey | undefined => {
  const nodeOperatorId = useNodeOperatorId();
  const { module } = useModule();
  return operatorKey(module, idOverride ?? nodeOperatorId);
};
