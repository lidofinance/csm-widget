import { FC } from 'react';
import { PATH } from 'consts/urls';
import { BackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { Group } from './group';
import { useNodeOperatorId, useOperatorGroupId } from 'modules/web3';
import { InlineLoader } from '@lidofinance/lido-ui';

export const GroupPage: FC = () => (
  <Layout
    noNav
    title={<GroupTitle />}
    subtitle={<GroupSubtitle />}
    pageName="Group"
  >
    <BackButton href={PATH.HOME} />
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
