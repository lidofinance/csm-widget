import { PATH } from 'consts/urls';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';
import { ClaimIcsPage } from 'features/claim-type';

const Page = () => (
  <PageGate path={PATH.TYPE_ICS_CLAIM}>
    <ClaimIcsPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
