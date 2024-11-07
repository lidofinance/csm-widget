import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Counter } from 'shared/components';
import { useNodeOperatorLockAmount } from 'shared/hooks';

export const CounterLockedBond: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: lockedBond } = useNodeOperatorLockAmount(nodeOperatorId);

  const count = Number(lockedBond?.gt(0));

  return <Counter warning count={count} />;
};
