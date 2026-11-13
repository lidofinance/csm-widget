import { FC, PropsWithChildren } from 'react';
import { NoAccessNotice, PausedNotice } from 'shared/form-page';
import { useModuleMeta } from 'shared/hooks';
import { useClaimBondFlow, useClaimBondFormData } from './context';
import { EmptyState } from './controls/empty-state';

export const ClaimBondFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useClaimBondFlow();
  const { isPaused } = useClaimBondFormData(true);
  const meta = useModuleMeta();

  if (flow.action === 'no-access') {
    return <NoAccessNotice access={flow.access} />;
  }

  if (flow.action === 'nothing') return <EmptyState />;

  if (isPaused) {
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
