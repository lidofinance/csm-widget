import { FC, PropsWithChildren } from 'react';
import { EmptyState, NoAccessNotice } from 'shared/components';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useEjectKeysFlow } from './context';

const EjectKeysFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useEjectKeysFlow();

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  if (flow.action === 'no-keys') {
    return (
      <EmptyState note="Only deposited keys that are eligible for triggerable withdrawals can be ejected. Keys must be deposited and meet withdrawal requirements to appear here.">
        No keys available to eject
      </EmptyState>
    );
  }

  return <>{children}</>;
};

export const EjectKeysFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <EjectKeysFormGate>{children}</EjectKeysFormGate>
  </FormLoader>
);
