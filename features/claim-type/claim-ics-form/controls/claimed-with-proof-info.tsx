import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormTitle } from 'shared/components';

export const ClaimedWithProofInfo: FC = () => (
  <>
    <FormTitle>You already have ICS operator type</FormTitle>
    <Text size="xs">
      Your current Node Operator is already an Identified Community Staker, but
      your address still has an unclaimed ICS proof. The proof remains available
      for use with another Node Operator on this address.
    </Text>
  </>
);
