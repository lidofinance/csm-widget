import { PATH } from 'consts/urls';
import { ManagerAddressPage } from 'features/change-role';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.SETTINGS_MANAGER_ADDRESS}>
    <ManagerAddressPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
