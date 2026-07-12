import { PATH } from 'consts/urls';
import { AddKeysPage } from 'features/add-keys';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.KEYS_SUBMIT}>
    <AddKeysPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
