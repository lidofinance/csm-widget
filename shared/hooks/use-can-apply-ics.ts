// import { OPERATOR_TYPE } from 'consts';
// import {
//   useDappStatus,
//   useIcsProof,
//   useNodeOperatorId,
//   useOperatorType,
// } from 'modules/web3';

// FIXME: update
export const useCanApplyICS = () => {
  // const nodeOperatorId = useNodeOperatorId();
  // const { data: type } = useOperatorType(nodeOperatorId);

  // const { address } = useDappStatus();
  // const { data: proof } = useIcsProof(address);

  // return Boolean(type !== OPERATOR_TYPE.ICS && !proof?.proof);
  return true;
};
