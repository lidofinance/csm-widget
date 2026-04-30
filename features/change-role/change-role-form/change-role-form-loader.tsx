import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useChangeRoleFlow } from './context';
import { Info } from './controls/info';

const ChangeRoleFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useChangeRoleFlow();
  return flow.action === 'view' ? <Info /> : <>{children}</>;
};

export const ChangeRoleFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <ChangeRoleFormGate>{children}</ChangeRoleFormGate>
  </FormLoader>
);
