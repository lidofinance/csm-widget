import { PATH } from 'consts/urls';
import { EjectKeysPage } from 'features/eject-keys';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.KEYS_EJECT}>
    <EjectKeysPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
