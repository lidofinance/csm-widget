import { secretConfig } from 'config';
import { HOME_PATH, KEYS_VIEW_PATH } from 'consts/urls';
import { AddKeysPage } from 'features/add-keys';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { SplashPage } from 'features/welcome';
import { GetStaticProps } from 'next';
import {
  GateActiveUser,
  GateCanCreate,
  GateLoaded,
  GateNodeOperator,
  GateRoleManager,
} from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser fallback={<Navigate path={HOME_PATH} />}>
      <GateNodeOperator
        fallback={
          <GateCanCreate fallback={<Navigate path={HOME_PATH} />}>
            <CreateNodeOperatorPage />
          </GateCanCreate>
        }
      >
        <GateRoleManager fallback={<Navigate path={KEYS_VIEW_PATH} />}>
          <AddKeysPage />
        </GateRoleManager>
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased } = secretConfig;
  if (notReleased) return { notFound: true };

  return { props: {} };
};
