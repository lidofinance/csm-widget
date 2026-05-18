import { FC, PropsWithChildren } from 'react';
import { EmptyState } from 'shared/components';
import { FormLoader } from 'shared/hook-form/form-controller';
import { ClaimIcsSuccess } from './claim-ics-success';
import { useClaimIcsFlow, useClaimIcsFormData } from './context';
import { ClaimedWithProofInfo } from './controls/claimed-with-proof-info';
import { Info } from './controls/info';

const EMPTY_STATE: Record<string, React.ReactNode> = {
  paused: <>ICS claiming is currently paused</>,
  claimed: <>You have already claimed the ICS operator type</>,
  'not-eligible': <>You are not eligible to claim the ICS operator type</>,
};

const ClaimIcsFormGate: FC<PropsWithChildren> = ({ children }) => {
  const { justClaimed } = useClaimIcsFormData();
  const flow = useClaimIcsFlow();

  if (justClaimed) return <ClaimIcsSuccess />;
  if (flow.action === 'no-access') return <Info />;
  if (flow.action === 'claimed-with-proof') return <ClaimedWithProofInfo />;

  const empty = EMPTY_STATE[flow.action];
  if (empty) return <EmptyState>{empty}</EmptyState>;

  return <>{children}</>;
};

export const ClaimIcsFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <ClaimIcsFormGate>{children}</ClaimIcsFormGate>
  </FormLoader>
);
