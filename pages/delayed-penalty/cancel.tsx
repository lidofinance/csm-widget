import { PATH } from 'consts/urls';
import { DelayedPenaltyCancelPage } from 'features/delayed-penalty';
import { PageGate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => (
  <PageGate path={PATH.DELAYED_PENALTY_CANCEL}>
    <DelayedPenaltyCancelPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
