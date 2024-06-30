import { secretConfig } from 'config';
import { HOME_PATH, KEYS_VIEW_PATH } from 'consts/urls';
import { AddKeysPage } from 'features/add-keys';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { SplashPage } from 'features/welcome';
import { getFaqList } from 'lib/faqList';
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

const faqList = getFaqList([
  'keys-why-upload-a-bond',
  'keys-how-much-bond-is-needed',
  'keys-what-is-the-bond-curve',
  'keys-difference-between-bond-types-eth-st-eth-wst-eth',
  'keys-when-does-a-validator-become-active',
  'keys-why-pay-for-key-deletion',
  'keys-can-t-see-the-key-for-deletion',
  'keys-what-to-do-in-case-of-technical-issues',
]);

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased } = secretConfig;
  if (notReleased) return { notFound: true };

  return {
    props: {
      faqList: await faqList,
    },
  };
};
