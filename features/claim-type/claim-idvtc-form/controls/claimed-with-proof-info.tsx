import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormTitle } from 'shared/components';

export const ClaimedWithProofInfo: FC = () => (
  <>
    <FormTitle>You already have IDVTC operator type</FormTitle>
    <Text size="xs">
      Your current Node Operator is already an Identified DVT Cluster, but your
      address still has an unclaimed IDVTC proof. You can create a separate Node
      Operator with the Identified DVT Cluster type using this proof.
    </Text>
  </>
);
