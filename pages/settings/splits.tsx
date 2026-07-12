import { PATH } from 'consts/urls';
import { SplitsPage } from 'features/change-role';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.SETTINGS_SPLITS}>
    <SplitsPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
