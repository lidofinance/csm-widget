import { PATH } from 'consts/urls';
import { WrappedPage } from 'features/wrapped';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <PageGate path={PATH.WRAPPED}>
    <WrappedPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
