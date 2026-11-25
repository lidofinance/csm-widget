import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  useIdvtcProof,
  useDappStatus,
  useModule,
  useNodeOperator,
  useOperatorIsOwner,
  useOperatorType,
} from 'modules/web3';
import { toConditionState } from 'shared/notifications/condition-state';
import type { ConditionState } from 'shared/notifications/types';

export const useCanClaimIDVTCState = (): ConditionState => {
  const { isCSM } = useModule();
  const { nodeOperator } = useNodeOperator();
  const nodeOperatorId = nodeOperator?.nodeOperatorId;
  const { address } = useDappStatus();
  const proofQuery = useIdvtcProof();
  const isOwnerQuery = useOperatorIsOwner({ nodeOperatorId });
  const operatorTypeQuery = useOperatorType(isCSM ? nodeOperator : undefined);

  return toConditionState({
    gate: isCSM && nodeOperatorId !== undefined && !!address,
    queries: [proofQuery, isOwnerQuery, operatorTypeQuery],
    active: () =>
      !!isOwnerQuery.data &&
      operatorTypeQuery.data !== OPERATOR_TYPE.CSM_IDVTC &&
      !!proofQuery.data?.proof &&
      !proofQuery.data.isConsumed,
  });
};

export const useCanClaimIDVTC = () => useCanClaimIDVTCState() === 'active';
