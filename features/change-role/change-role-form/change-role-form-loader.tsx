import { FC, PropsWithChildren } from 'react';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import { useChangeRoleFlow } from './context';
import { Info } from './controls/info';

const ChangeRoleFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useChangeRoleFlow();
  return flow.action === 'view' ? (
    <Form>
      <Info />
    </Form>
  ) : (
    <>{children}</>
  );
};

export const ChangeRoleFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <ChangeRoleFormGate>{children}</ChangeRoleFormGate>
  </FormLoader>
);
