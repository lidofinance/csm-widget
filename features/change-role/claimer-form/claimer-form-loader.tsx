import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useClaimerFlow } from './context';
import { Info } from './controls/info';

const ClaimerFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useClaimerFlow();
  return flow.action === 'view' ? <Info /> : <>{children}</>;
};

export const ClaimerFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <ClaimerFormGate>{children}</ClaimerFormGate>
  </FormLoader>
);
