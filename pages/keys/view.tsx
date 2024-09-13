import { PATH } from 'consts/urls';
import { ViewKeysPage } from 'features/view-keys';
import { SplashPage } from 'features/welcome';
import { getFaqKeys } from 'lib/getFaq';
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
        <ViewKeysPage />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getStaticProps = getProps(getFaqKeys);
