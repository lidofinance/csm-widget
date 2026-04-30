import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useAddBondFlow } from './context';
import { Info } from './controls/info';

const AddBondFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useAddBondFlow();

  const isReadOnly = flow.action === 'no-access';

  return isReadOnly ? <Info /> : <>{children}</>;
};

export const AddBondFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <AddBondFormGate>{children}</AddBondFormGate>
  </FormLoader>
);
