import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice } from 'shared/components';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useNormalizeQueueFlow } from './context';

const NormalizeQueueFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useNormalizeQueueFlow();

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  return <>{children}</>;
};

export const NormalizeQueueFormLoader: FC<PropsWithChildren> = ({
  children,
}) => (
  <FormLoader>
    <NormalizeQueueFormGate>{children}</NormalizeQueueFormGate>
  </FormLoader>
);
