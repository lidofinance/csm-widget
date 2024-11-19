import { FC } from 'react';
import { Counter } from 'shared/components';
import { useInvites } from 'shared/hooks';

export const CounterInvites: FC = () => {
  const { data: invites } = useInvites();
  const count = invites?.length;

  return <Counter count={count} />;
};
