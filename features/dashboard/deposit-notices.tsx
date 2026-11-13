import { MessageBox } from '@lidofinance/lido-app-ui';
import {
  useModule,
  useNodeOperatorId,
  useTopUpAllocationEnabled,
} from 'modules/web3';
import { FC } from 'react';
import { useDepositsPaused } from './hooks/use-deposits-paused';

const PAUSED_BODY = {
  noGroup:
    'Your sub-operator is unable to receive deposits because it has not yet been added to the Node Operator group. Deposits will be enabled once the CMC adds it to the group.',
  weightZero:
    'Your sub-operator is unable to receive deposits because its weight in the Node Operator group is zero. Deposits will be enabled once the CMC updates its weight.',
};

export const DepositNotices: FC = () => {
  const { isCM } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { isPending, isError, isPaused, hasGroup } = useDepositsPaused();
  const { data: topUpEnabled } = useTopUpAllocationEnabled({ nodeOperatorId });

  if (!isCM || isPending || isError) return null;

  if (isPaused) {
    return (
      <MessageBox
        variant="warning"
        headline="Deposits to this Node Operator are currently paused"
        dataTestId={{ root: 'depositsPausedNotice' }}
      >
        {hasGroup ? PAUSED_BODY.weightZero : PAUSED_BODY.noGroup}
      </MessageBox>
    );
  }

  if (topUpEnabled === false) {
    return (
      <MessageBox
        variant="warning"
        headline="Top-up deposits to this Node Operator are currently disabled"
        dataTestId={{ root: 'topUpDisabledNotice' }}
      >
        Your operator is still eligible to receive seed deposits. Top-up
        deposits can be enabled by the CMC.
      </MessageBox>
    );
  }

  return null;
};
