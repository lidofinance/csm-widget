import { secretConfig } from 'config';
import { ROLES } from 'consts/roles';
import { PATH } from 'consts/urls';
import { RemoveKeysPage } from 'features/remove-keys';
import { SplashPage } from 'features/welcome';
import { getFaqList } from 'lib/faqList';
import { GetStaticProps } from 'next';
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
        fallback={<Navigate path={PATH.KEYS} fallback={<SplashPage />} />}
      >
        <GateRole
          role={ROLES.MANAGER}
          fallback={<Navigate path={PATH.KEYS} fallback={<SplashPage />} />}
        >
          <RemoveKeysPage />
        </GateRole>
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
  const { notReleased, maintenance } = secretConfig;
  if (notReleased || maintenance) return { notFound: true };

  return { props: { faqList: await faqList } };
};
