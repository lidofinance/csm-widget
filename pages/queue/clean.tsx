import { CleanQueuePage } from 'features/clean-queue';
import { getProps } from 'utilsApi';
import { GateLoaded } from 'shared/navigate';

const Page = () => (
  <GateLoaded>
    <CleanQueuePage />
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
