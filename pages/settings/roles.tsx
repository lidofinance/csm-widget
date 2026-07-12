import { PATH } from 'consts/urls';
import { RolesPage } from 'features/change-role';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.SETTINGS_ROLES}>
    <RolesPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
