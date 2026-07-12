import { PATH } from 'consts/urls';
import { NormalizeQueuePage } from 'features/normalize-queue';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.KEYS_NORMALIZE}>
    <NormalizeQueuePage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
