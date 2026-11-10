import type { OperatorTypeStatus } from 'modules/web3';
import type { TypeProgram } from '../type-status/consts';

export const getTypeStatusDescription = (
  program: TypeProgram,
  typeStatus: OperatorTypeStatus,
  hasOperator: boolean,
): string | undefined => {
  switch (typeStatus) {
    case 'CLAIMED':
      return `Your Node Operator already has ${program} type`;
    case 'PROOF_USED_ELSEWHERE':
      return `Your address has already used its ${program} proof on another Node Operator`;
    case 'PROOF_USED':
      return `Your address has already used its ${program} proof`;
    case 'ISSUED_NOT_OWNER':
      return `You're already eligible to claim ${program} type. To claim, your current address should be set as your Node Operator owner.`;
    case 'OWNER_ISSUED':
      return `Node Operator's owner address is already eligible to claim ${program} type. Connect with your Node Operator's owner address to claim ${program} type.`;
    case 'OTHER_ISSUED':
      return `Another address of your Node Operator is already eligible to claim ${program} type. To claim, it should be set as your Node Operator owner.`;
    case 'ISSUED':
      return hasOperator
        ? 'Claim your new operator type on the “Claim operator type” tab'
        : `Create a new Node Operator with ${program} operator type`;
    default:
      return undefined;
  }
};
