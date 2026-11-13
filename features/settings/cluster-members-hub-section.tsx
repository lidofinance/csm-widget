import { PATH } from 'consts/urls';
import { ClusterMembersSection } from 'features/idvtc/members';
import { FC } from 'react';
import { useSiweAuth } from 'modules/siwe';
import { HubList, HubRow, HubSection } from 'shared/components';
import { useShowFlags } from 'shared/hooks';

const ClusterMembersHubContent: FC = () => {
  const { token } = useSiweAuth();

  if (token) return <ClusterMembersSection />;

  return (
    <HubSection title="Cluster members" dataTestId="clusterMembersSection">
      <HubList>
        <HubRow
          title="Cluster members"
          href={PATH.IDVTC_MEMBERS}
          dataTestId="clusterMembersRow"
        />
      </HubList>
    </HubSection>
  );
};

export const ClusterMembersHubSection: FC = () => {
  const { IS_IDVTC } = useShowFlags();

  return IS_IDVTC ? <ClusterMembersHubContent /> : null;
};
