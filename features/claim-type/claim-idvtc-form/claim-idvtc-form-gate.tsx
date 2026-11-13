import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import { FormCard, NoAccessNotice, PausedNotice } from 'shared/form-page';
import { ClaimIdvtcCards, CreateIdvtcButton } from './claim-idvtc-cards';
import { useClaimIdvtcFlow } from './context';
import { NarrowStyle } from './styles';

const EMPTY_STATE = {
  'wrong-module':
    'The IDVTC operator type is not available for the selected operator',
  claimed: 'You have already claimed the IDVTC operator type',
  'not-eligible': 'You are not eligible to claim the IDVTC operator type',
};

export const ClaimIdvtcFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useClaimIdvtcFlow();

  switch (flow.action) {
    case 'claim':
      return <>{children}</>;
    case 'no-access':
      return <ClaimIdvtcCards cta={<NoAccessNotice access={flow.access} />} />;
    case 'paused':
      return (
        <NarrowStyle>
          <PausedNotice headline="IDVTC is paused">
            IDVTC claiming is currently paused
          </PausedNotice>
        </NarrowStyle>
      );
    case 'claimed-with-proof':
      return (
        <NarrowStyle>
          <FormCard
            title="You already have IDVTC operator type"
            description="Your current Node Operator is already an Identified DVT Cluster, but your address still has an unclaimed IDVTC proof. You can create a separate Node Operator with the Identified DVT Cluster type using this proof."
          >
            <CreateIdvtcButton />
          </FormCard>
        </NarrowStyle>
      );
    default:
      return (
        <NarrowStyle>
          <MessageBox dataTestId={{ root: 'claimTypeEmpty' }}>
            {EMPTY_STATE[flow.action]}
          </MessageBox>
        </NarrowStyle>
      );
  }
};
