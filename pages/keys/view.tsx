import { PATH } from 'consts/urls';
import { ViewKeysPage } from 'features/view-keys';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.KEYS_VIEW}>
    <ViewKeysPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
