import { PATH } from 'consts/urls';
import { ClaimBondPage } from 'features/claim-bond';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.BOND_CLAIM}>
    <ClaimBondPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
