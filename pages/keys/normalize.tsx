import { PATH } from 'consts/urls';
import { NormalizeQueuePage } from 'features/normalize-queue';
import { SplashPage } from 'features/welcome';
import { getProps } from 'lib/getProps';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <GateNodeOperator
        fallback={<Navigate path={PATH.KEYS} fallback={<SplashPage />} />}
      >
        <NormalizeQueuePage />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps();
