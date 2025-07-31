import { useInvites } from 'modules/web3';
import { FC } from 'react';
import { Counter } from 'shared/components';

export const CounterInvites: FC = () => {
  const { data: invites } = useInvites();
  const count = invites?.length;

  return <Counter count={count} />;
};
