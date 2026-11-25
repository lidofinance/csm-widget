import { useInvites } from 'modules/web3';
import { FC } from 'react';
import { NavCounter } from './nav-counter';

export const CounterInvites: FC = () => {
  const { data: invites } = useInvites();
  const count = invites?.length;

  return <NavCounter count={count} />;
};
