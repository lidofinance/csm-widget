import { secretConfig } from 'config';
import { PATH } from 'consts/urls';
import { RemoveKeysPage } from 'features/remove-keys';
import { SplashPage } from 'features/welcome';
import { getFaqList } from 'lib/faqList';
import { GetStaticProps } from 'next';
import {
  GateActiveUser,
  GateLoaded,
  GateNodeOperator,
  GateRoleManager,
} from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <GateNodeOperator
        fallback={<Navigate path={PATH.KEYS} fallback={<SplashPage />} />}
      >
        <GateRoleManager
          fallback={<Navigate path={PATH.KEYS} fallback={<SplashPage />} />}
        >
          <RemoveKeysPage />
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
  'keys-how-to-set-up-a-validator-for-csm-testnet',
  'keys-when-does-a-validator-become-active',
  'keys-why-pay-for-key-deletion',
  'keys-can-t-see-the-key-for-deletion',
  'keys-what-to-do-in-case-of-technical-issues',
]);

export const getStaticProps: GetStaticProps = async () => {
  const { notReleased } = secretConfig;
  if (notReleased) return { notFound: true };

  return { props: { faqList: await faqList } };
};
