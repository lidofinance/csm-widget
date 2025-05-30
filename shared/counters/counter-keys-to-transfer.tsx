import { useNodeOperatorId } from 'modules/web3';
import { useOperatorKeysToMigrate } from 'modules/web3/hooks/use-operator-keys-to-migrate';
import { FC } from 'react';
import { Counter } from 'shared/components';

export const CounterKeysToTransfer: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: count } = useOperatorKeysToMigrate(nodeOperatorId);

  return <Counter warning count={count} />;
};
