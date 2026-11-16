import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import { FormCard, NoAccessNotice, PausedNotice } from 'shared/form-page';
import { ClaimIcsCard } from './claim-ics-card';
import { useClaimIcsFlow } from './context';

const EMPTY_STATE = {
  'wrong-module':
    'The ICS operator type is not available for the selected operator',
  claimed: 'You have already claimed the ICS operator type',
  'not-eligible': 'You are not eligible to claim the ICS operator type',
};

export const ClaimIcsFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useClaimIcsFlow();

  switch (flow.action) {
    case 'claim':
      return <>{children}</>;
    case 'paused':
      return (
        <PausedNotice headline="ICS is paused">
          ICS claiming is currently paused
        </PausedNotice>
      );
    case 'no-access':
      return <ClaimIcsCard cta={<NoAccessNotice access={flow.access} />} />;
    case 'claimed-with-proof':
      return (
        <FormCard
          title="You already have ICS operator type"
          description="Your current Node Operator is already an Identified Community Staker, but your address still has an unclaimed ICS proof. The proof remains available for use with another Node Operator on this address."
        />
      );
    default:
      return (
        <MessageBox dataTestId={{ root: 'claimTypeEmpty' }}>
          {EMPTY_STATE[flow.action]}
        </MessageBox>
      );
  }
};
