import { MessageBox } from '@lidofinance/lido-app-ui';
import { UNBONDED_VALIDATORS_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { useAddBondFormData } from './context';

const NOTICE_TEST_ID = { root: 'formInfoText' };

export const InsufficientBondNotice: FC = () => {
  const { bond } = useAddBondFormData();

  if (!bond?.isInsufficient) return null;

  return (
    <MessageBox
      variant="warning"
      headline="Action required:"
      dataTestId={NOTICE_TEST_ID}
    >
      Your Node Operator has an Insufficient bond because of the penalty
      applied. Now your Node Operator&apos;s bond is less than required to cover
      the Node Operator&apos;s current validators. Top up the bond by submitting
      the required difference to be able to claim new rewards and to prevent
      your validator becoming unbonded and being requested to exit.
    </MessageBox>
  );
};

export const WhyAddBondNotice: FC = () => {
  const { bond } = useAddBondFormData();

  if (!bond || bond.isInsufficient) return null;

  return (
    <MessageBox
      headline="Why you might need to add bond:"
      dataTestId={NOTICE_TEST_ID}
    >
      Adding a bond serves as a voluntary security measure for your Node
      Operator to prevent your validators from becoming{' '}
      <MatomoLink
        $inline
        href={UNBONDED_VALIDATORS_LINK}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.unbondedValidatorsLink}
      >
        unbonded
      </MatomoLink>{' '}
      and being requested to exit in case of applied penalties.
      <br />
      Supplied bond will be stored as stETH, which also garners staking rewards.
    </MessageBox>
  );
};
