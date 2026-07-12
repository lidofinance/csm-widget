import { PATH } from 'consts/urls';
import { ExitKeysPage } from 'features/exit-keys';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <PageGate path={PATH.KEYS_EXIT}>
    <ExitKeysPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
