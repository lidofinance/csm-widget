import { useNodeOperatorId, useTargetModule } from 'modules/web3';
import type { OperatorKey } from '../api/types';
import { operatorKey } from '../api/url';

export const useOperatorKey = (
  idOverride?: bigint,
): OperatorKey | undefined => {
  const targetModule = useTargetModule();
  const nodeOperatorId = useNodeOperatorId();
  return operatorKey(targetModule, idOverride ?? nodeOperatorId);
};
