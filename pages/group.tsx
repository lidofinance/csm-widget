import { PATH } from 'consts/urls';
import { GroupPage } from 'features/group';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';
import { useNodeOperatorId } from 'modules/web3/operator-provider/node-operator-provider';
import { useOperatorGroup } from 'modules/web3/hooks/use-operator-group';

const Page = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { isPending } = useOperatorGroup(nodeOperatorId);

  return (
    <PageGate path={PATH.GROUP} dataLoading={isPending}>
      <GroupPage />
    </PageGate>
  );
};

export default Page;

export const getServerSideProps = getProps();
