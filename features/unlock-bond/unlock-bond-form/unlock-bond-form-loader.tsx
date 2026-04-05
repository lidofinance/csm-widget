import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useUnlockBondFlow } from './context';
import { Info } from './controls/info';

const UnlockBondFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useUnlockBondFlow();

  const isReadOnly =
    flow.action === 'nothing' ||
    flow.action === 'no-access' ||
    flow.action === 'insufficient-bond';

  return isReadOnly ? <Info /> : <>{children}</>;
};

export const UnlockBondFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <UnlockBondFormGate>{children}</UnlockBondFormGate>
  </FormLoader>
);
