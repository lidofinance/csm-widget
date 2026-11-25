import { useNodeOperatorId, useOperatorInfo } from 'modules/web3';
import { FC } from 'react';
import { NavCounter } from './nav-counter';

export const useInvalidKeysCount = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo({ nodeOperatorId });

  return info ? Math.min(info.totalAddedKeys - info.totalVettedKeys, 1) : 0;
};

export const CounterInvalidKeys: FC = () => (
  <NavCounter variant="warning" count={useInvalidKeysCount()} />
);
