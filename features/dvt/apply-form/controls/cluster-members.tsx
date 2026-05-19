import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { FormTitle, Stack } from 'shared/components';
import { CLUSTER_SIZE, type DvtApplyFormInputType } from '../context';
import { ProgressBar, ProgressBarFill, ProgressBarTrack } from '../styles';
import { ClusterMemberItem } from './cluster-member-item';

export const ClusterMembers: FC = () => {
  const clusterMembers = useWatch<DvtApplyFormInputType>({
    name: 'clusterMembers',
  }) as DvtApplyFormInputType['clusterMembers'];

  const verifiedCount = clusterMembers?.filter((m) => m.verified).length ?? 0;

  return (
    <Stack direction="column" gap="md" data-testid="clusterMembersSection">
      <Stack direction="column" gap="xxs">
        <FormTitle>Cluster member addresses</FormTitle>
        <Text size="xs" color="secondary">
          Verify ownership of {CLUSTER_SIZE} additional Ethereum addresses in
          your validator cluster.
        </Text>
      </Stack>

      <ProgressBar>
        <ProgressBarTrack>
          <ProgressBarFill $progress={verifiedCount / CLUSTER_SIZE} />
        </ProgressBarTrack>
        <Text size="xxs" color="secondary">
          {verifiedCount} / {CLUSTER_SIZE} verified
        </Text>
      </ProgressBar>

      {Array.from({ length: CLUSTER_SIZE }, (_, index) => (
        <ClusterMemberItem key={index} index={index} />
      ))}
    </Stack>
  );
};
