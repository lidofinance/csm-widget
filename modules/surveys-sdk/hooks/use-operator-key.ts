import { config } from 'config';
import { useNodeOperatorId } from 'modules/web3';
import type { OperatorKey } from '../api/types';
import { operatorKey } from '../api/url';

export const useOperatorKey = (
  idOverride?: bigint,
): OperatorKey | undefined => {
  const nodeOperatorId = useNodeOperatorId();
  return operatorKey(config.module, idOverride ?? nodeOperatorId);
};
