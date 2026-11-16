import { useNodeOperatorId, useOperatorBalance } from 'modules/web3';
import { FC } from 'react';
import { NavCounter } from './nav-counter';

export const CounterLockedBond: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: balance } = useOperatorBalance({ nodeOperatorId });

  const count = balance?.locked ? 1 : 0;

  return <NavCounter variant="warning" count={count} />;
};
