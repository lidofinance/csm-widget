import { PATH } from 'consts/urls';
import { ClaimIdvtcPage } from 'features/claim-type';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <PageGate path={PATH.TYPE_DVT_CLAIM}>
    <ClaimIdvtcPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
