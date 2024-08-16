import { ContractReceipt } from 'ethers';
import { NodeOperatorAddedEvent } from 'generated/CSModule';
import { NodeOperatorId } from 'types';

export const getAddedNodeOperator = (receipt: ContractReceipt) => {
  const event = receipt.events?.find(
    ({ event }) => event === 'NodeOperatorAdded',
  ) as NodeOperatorAddedEvent | undefined;

  return event?.args.nodeOperatorId.toString() as NodeOperatorId | undefined;
};
