import { PATH } from 'consts/urls';
import { AddBondPage } from 'features/add-bond';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.BOND_ADD}>
    <AddBondPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
