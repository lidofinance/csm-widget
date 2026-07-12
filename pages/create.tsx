import { PATH } from 'consts/urls';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.CREATE}>
    <CreateNodeOperatorPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
