import { ContractReceipt } from 'ethers';
import { NodeOperatorAddedEvent } from 'generated/CSModule';

export const getAddedNodeOperator = (receipt: ContractReceipt) => {
  const event = receipt.events?.find(
    ({ event }) => event === 'NodeOperatorAdded',
  ) as NodeOperatorAddedEvent | undefined;

  return event?.args.nodeOperatorId;
};
