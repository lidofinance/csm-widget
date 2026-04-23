import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useClaimBondFlow } from './context';
import { EmptyState } from './controls/empty-state';

const ClaimBondFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useClaimBondFlow();

  if (flow.action === 'no-access') return null; // FIXME: show access info

  if (flow.action === 'nothing') return <EmptyState />;

  return <>{children}</>;
};

export const ClaimBondFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <ClaimBondFormGate>{children}</ClaimBondFormGate>
  </FormLoader>
);
