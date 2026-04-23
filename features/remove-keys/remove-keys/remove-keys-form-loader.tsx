import { FC, PropsWithChildren } from 'react';
import { EmptyState, NoAccessNotice } from 'shared/components';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useRemoveKeysFlow } from './context';

const RemoveKeysFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useRemoveKeysFlow();

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  if (flow.action === 'no-keys') {
    return (
      <EmptyState note="Only keys that have not been deposited yet can be deleted. If a key has already been deposited, the only way to retrieve the bond is to exit the validator on the Consensus Layer (CL).">
        No keys available to remove
      </EmptyState>
    );
  }

  return <>{children}</>;
};

export const RemoveKeysFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <RemoveKeysFormGate>{children}</RemoveKeysFormGate>
  </FormLoader>
);
