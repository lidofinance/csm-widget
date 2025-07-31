import { useNodeOperatorId, useOperatorInfo } from 'modules/web3';
import { FC } from 'react';
import { Counter } from 'shared/components';

export const CounterInvalidKeys: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);

  const count = info ? info.totalAddedKeys - info.totalVettedKeys : 0;

  return <Counter warning count={count} />;
};
