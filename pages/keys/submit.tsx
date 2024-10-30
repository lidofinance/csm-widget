import { ROLES } from 'consts/roles';
import { PATH } from 'consts/urls';
import { AddKeysPage } from 'features/add-keys';
import { SplashPage } from 'features/welcome';
import { getFaqKeys } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import {
  GateActiveUser,
  GateLoaded,
  GateNodeOperator,
  GateRole,
} from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <GateNodeOperator
        fallback={<Navigate path={PATH.CREATE} fallback={<SplashPage />} />}
      >
        <GateRole
          role={ROLES.MANAGER}
          fallback={<Navigate path={PATH.KEYS} fallback={<SplashPage />} />}
        >
          <AddKeysPage />
        </GateRole>
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqKeys);
