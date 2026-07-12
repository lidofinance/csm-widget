import { PATH } from 'consts/urls';
import { RemoveKeysPage } from 'features/remove-keys';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.KEYS_REMOVE}>
    <RemoveKeysPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
