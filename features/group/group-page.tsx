import {
  useNodeOperatorId,
  useOperatorGroup,
  useOperatorGroupId,
} from 'modules/web3';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Group } from './group';
import { BackButton, ShortInlineLoader } from 'shared/components';
import { formatGroupTitle } from 'shared/node-operator';

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
  const { data: group, isPending } = useOperatorGroup(nodeOperatorId);

  return isPending ? (
    <ShortInlineLoader />
  ) : group ? (
    <>{formatGroupTitle(group)}</>
  ) : (
    <>No group attached to operator</>
  );
};

const GroupSubtitle: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: groupId } = useOperatorGroupId(nodeOperatorId);

  return groupId ? (
    <>View all of the sub-operators within your Node Operator Group</>
  ) : null;
};
