import { BigNumber } from 'ethers';
import { NodeOperatorId } from 'types';

type EventWithNodeOperator = {
  args: { nodeOperatorId: BigNumber };
};

export function getNodeOperatorIdFromEvent(event: undefined): undefined;
export function getNodeOperatorIdFromEvent(
  event: EventWithNodeOperator,
): NodeOperatorId;
// eslint-disable-next-line func-style
export function getNodeOperatorIdFromEvent(
  event: EventWithNodeOperator | undefined,
) {
  return event ? `${event.args.nodeOperatorId.toNumber()}` : undefined;
}
