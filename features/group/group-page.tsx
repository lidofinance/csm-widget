import { InlineLoader } from '@lidofinance/lido-ui';
import { useNodeOperatorId, useOperatorGroupId } from 'modules/web3';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Group } from './group';
import { BackButton } from 'shared/components';

export const GroupPage: FC = () => (
  <Layout
    fullwidth
    mainPrefix={<BackButton />}
    title={<GroupTitle />}
    subtitle={<GroupSubtitle />}
    pageName="Group"
  >
    <Group />
  </Layout>
);

const GroupTitle: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: groupId, isPending } = useOperatorGroupId(nodeOperatorId);

  return isPending ? (
    <InlineLoader />
  ) : groupId ? (
    <>Operator Group #{`${groupId}`}</>
  ) : (
    <>No group attached to operator</>
  );
};

const GroupSubtitle: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: groupId } = useOperatorGroupId(nodeOperatorId);

  return groupId ? (
    <>
      This group is responsible for managing the infrastructure and keys for a
      set of node operators
    </>
  ) : null;
};
