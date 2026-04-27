import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice } from 'shared/components';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useAddKeysFlow } from './context';

const AddKeysFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useAddKeysFlow();

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  return <>{children}</>;
};

export const AddKeysFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <AddKeysFormGate>{children}</AddKeysFormGate>
  </FormLoader>
);
