import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  useIcsProof,
  useDappStatus,
  useModule,
  useNodeOperator,
  useOperatorIsOwner,
  useOperatorType,
} from 'modules/web3';

export const useCanClaimICS = () => {
  const { isCSM } = useModule();
  const { nodeOperator } = useNodeOperator();
  const nodeOperatorId = nodeOperator?.nodeOperatorId;
  const { address } = useDappStatus();
  const { data: proof } = useIcsProof();
  const { data: isOwner } = useOperatorIsOwner({ nodeOperatorId });
  const operatorTypeQuery = useOperatorType(isCSM ? nodeOperator : undefined);

  return Boolean(
    isCSM &&
    nodeOperatorId !== undefined &&
    address &&
    isOwner &&
    operatorTypeQuery.isSuccess &&
    operatorTypeQuery.data !== OPERATOR_TYPE.CSM_ICS &&
    proof?.proof &&
    !proof.isConsumed,
  );
};
