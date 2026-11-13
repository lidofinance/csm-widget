import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice } from 'shared/form-page';
import { useTopUpAllocationFlow } from './context';
import { TopUpLockedCard } from './top-up-card';

export const TopUpAllocationFormGate: FC<PropsWithChildren> = ({
  children,
}) => {
  const flow = useTopUpAllocationFlow();

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  if (flow.action === 'locked') return <TopUpLockedCard />;

  return <>{children}</>;
};
