import { MessageBox, TextLink } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC, ReactNode } from 'react';
import { SplitsNotice as SplitsNoticeKind } from '../splits-state';

const ClaimLink: FC<{ children: ReactNode }> = ({ children }) => (
  <TextLink href={PATH.BOND_CLAIM}>{children}</TextLink>
);

const NOTICES: Record<
  SplitsNoticeKind,
  { headline?: string; body: ReactNode }
> = {
  canSetupBeforeFirstRewards: {
    body: 'You can set up rewards splitting now. Please note that editing will only be available after your first rewards are distributed.',
  },
  unclaimedBeforeSetup: {
    headline: 'Unclaimed rewards',
    body: (
      <>
        You have unclaimed rewards. If you set up splitting now, unclaimed
        rewards will be distributed using the new split settings. To keep
        current distribution, <ClaimLink>claim your rewards first</ClaimLink>.
      </>
    ),
  },
  disabledNoProof: {
    body: 'Editing is disabled while your first rewards have not been distributed yet',
  },
  disabledUnclaimed: {
    headline: 'Unclaimed rewards',
    body: (
      <>
        Editing is disabled while you have unclaimed rewards.{' '}
        <ClaimLink>Claim them in Bond & Rewards</ClaimLink> to continue.
        Unclaimed rewards will be distributed using your current split settings.
      </>
    ),
  },
  disabledPending: {
    body: (
      <>
        Editing is disabled while there are pending shares to distribute.{' '}
        <ClaimLink>Claim them in Bond & Rewards</ClaimLink> to continue.
      </>
    ),
  },
};

export const SplitsNotice: FC<{ notice: SplitsNoticeKind }> = ({ notice }) => {
  const { headline, body } = NOTICES[notice];

  return (
    <MessageBox
      variant="info"
      headline={headline}
      dataTestId={{ root: 'splitsNotice' }}
    >
      {body}
    </MessageBox>
  );
};
