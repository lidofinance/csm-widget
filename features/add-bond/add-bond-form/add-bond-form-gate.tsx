import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice, PausedNotice } from 'shared/form-page';
import { useModuleMeta } from 'shared/hooks';
import { useAddBondFlow } from './context';

export const AddBondFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useAddBondFlow();
  const meta = useModuleMeta();

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  if (flow.action === 'paused') {
    return (
      <PausedNotice
        headline={`${meta?.shortName ?? 'Module'} Accounting is paused`}
      >
        This means that claim and add bond is currently not possible
      </PausedNotice>
    );
  }

  return <>{children}</>;
};
