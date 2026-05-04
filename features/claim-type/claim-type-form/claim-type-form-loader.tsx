import { FC, PropsWithChildren } from 'react';
import { EmptyState } from 'shared/components';
import { FormLoader } from 'shared/hook-form/form-controller';
import { ClaimTypeSuccess } from './claim-type-success';
import { useClaimTypeFlow, useClaimTypeFormData } from './context';
import { Info } from './controls/info';

const EMPTY_STATE: Record<string, React.ReactNode> = {
  paused: <>ICS claiming is currently paused</>,
  claimed: <>You have already claimed the ICS operator type</>,
  'not-eligible': <>You are not eligible to claim the ICS operator type</>,
};

const ClaimTypeFormGate: FC<PropsWithChildren> = ({ children }) => {
  const { justClaimed } = useClaimTypeFormData();
  const flow = useClaimTypeFlow();

  if (justClaimed) return <ClaimTypeSuccess />;
  if (flow.action === 'no-access') return <Info />;

  const empty = EMPTY_STATE[flow.action];
  if (empty) return <EmptyState>{empty}</EmptyState>;

  return <>{children}</>;
};

export const ClaimTypeFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <ClaimTypeFormGate>{children}</ClaimTypeFormGate>
  </FormLoader>
);
