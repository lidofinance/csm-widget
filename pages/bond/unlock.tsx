import { PATH } from 'consts/urls';
import { UnlockBondPage } from 'features/unlock-bond/unlock-bond-page';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.BOND_UNLOCK}>
    <UnlockBondPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
