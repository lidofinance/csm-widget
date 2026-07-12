import { PATH } from 'consts/urls';
import { RewardAddressPage } from 'features/change-role';
import { getProps } from 'utilsApi';
import { PageGate } from 'shared/navigate';

const Page = () => (
  <PageGate path={PATH.SETTINGS_REWARDS_ADDRESS}>
    <RewardAddressPage />
  </PageGate>
);

export default Page;

export const getServerSideProps = getProps();
