import { PATH } from 'consts/urls';
import { ClaimerPage } from 'features/change-role';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.SETTINGS_CLAIMER}>
    <ClaimerPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
