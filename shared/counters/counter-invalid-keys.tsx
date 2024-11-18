import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Counter } from 'shared/components';
import { useNodeOperatorInfo } from 'shared/hooks';

export const CounterInvalidKeys: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(nodeOperatorId);

  const count = info ? info.totalAddedKeys - info.totalVettedKeys : 0;

  return <Counter warning count={count} />;
};
