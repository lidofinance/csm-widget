import { ContractReceipt, utils } from 'ethers';
import { CSModule__factory } from 'generated';
import { NodeOperatorAddedEvent } from 'generated/CSModule';
import invariant from 'tiny-invariant';
import { getNodeOperatorIdFromEvent } from 'utils';

const NODE_OPERATOR_ADDED_EVENT_NAME = 'NodeOperatorAdded';

export const getAddedNodeOperator = (receipt: ContractReceipt) => {
  const int = CSModule__factory.createInterface();
  const eventSignature = Object.keys(int.events).find((key) =>
    key.startsWith(NODE_OPERATOR_ADDED_EVENT_NAME),
  );
  invariant(eventSignature);
  const eventTopic = utils.id(eventSignature);

  const log = receipt.logs.find((log) => log.topics[0] === eventTopic);
  if (log) {
    const event = int.parseLog(log) as any as NodeOperatorAddedEvent;
    return {
      id: getNodeOperatorIdFromEvent(event),
      manager: event.args.managerAddress,
      rewards: event.args.rewardAddress,
    };
  }
  return undefined;
};
