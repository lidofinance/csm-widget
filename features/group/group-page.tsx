import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { GroupSection } from 'features/my-operators/group-section';
import { FC, useCallback } from 'react';
import { Layout } from 'shared/layout';
import { useNavigate } from 'shared/navigate';

type Props = { nodeOperatorId: NodeOperatorId };

export const GroupPage: FC<Props> = ({ nodeOperatorId }) => {
  const navigate = useNavigate();
  const onMissing = useCallback(() => navigate(PATH.MY_OPERATORS), [navigate]);

  return (
    <Layout
      wide
      pageName="Group"
      breadcrumbs={[
        { label: 'My Operators', href: PATH.MY_OPERATORS },
        { label: 'Group' },
      ]}
    >
      <GroupSection nodeOperatorId={nodeOperatorId} onMissing={onMissing} />
    </Layout>
  );
};
