import { PATH } from 'consts/urls';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { SplashPage } from 'features/welcome';
import { getFaqKeys } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import {
  GateActiveUser,
  GateCanCreate,
  GateLoaded,
  GateNodeOperator,
} from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <GateNodeOperator
        fallback={
          <GateCanCreate
            fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
          >
            <CreateNodeOperatorPage />
          </GateCanCreate>
        }
      >
        <Navigate path={PATH.KEYS_VIEW} fallback={<SplashPage />} />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getStaticProps = getProps(getFaqKeys);
