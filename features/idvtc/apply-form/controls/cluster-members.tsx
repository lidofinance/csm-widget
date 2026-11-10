import { Description, ProgressBar, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { CLUSTER_SIZE, type IdvtcApplyFormInputType } from '../context';
import { ApplySection } from './apply-section';
import { ClusterMemberItem } from './cluster-member-item';

export const ClusterMembers: FC = () => {
  const clusterMembers = useWatch<IdvtcApplyFormInputType>({
    name: 'clusterMembers',
  }) as IdvtcApplyFormInputType['clusterMembers'];

  const verifiedCount = clusterMembers?.filter((m) => m.verified).length ?? 0;

  return (
    <ApplySection
      title="Cluster member addresses"
      subtitle={`Verify ownership of ${CLUSTER_SIZE} additional Ethereum addresses in your validator cluster`}
      data-testid="clusterMembersSection"
    >
      <Stack
        direction="row"
        align="center"
        gap={12}
        data-testid="clusterProgress"
      >
        <ProgressBar
          aria-label="Verified cluster members"
          segments={[{ value: verifiedCount, color: 'success' }]}
          max={CLUSTER_SIZE}
          style={{ flex: 1 }}
        />
        <Description color="secondary">
          {verifiedCount} / {CLUSTER_SIZE} verified
        </Description>
      </Stack>

      {Array.from({ length: CLUSTER_SIZE }, (_, index) => (
        <ClusterMemberItem key={index} index={index} />
      ))}
    </ApplySection>
  );
};
