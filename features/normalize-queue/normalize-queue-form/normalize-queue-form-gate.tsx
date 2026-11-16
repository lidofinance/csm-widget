import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice } from 'shared/form-page';
import { useNormalizeQueueFlow } from './context';

export const NormalizeQueueFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useNormalizeQueueFlow();

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  return <>{children}</>;
};
