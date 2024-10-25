import { PATH } from 'consts/urls';
import { ClaimBondPage } from 'features/claim-bond';
import { SplashPage } from 'features/welcome';
import { getFaqBond } from 'lib/getFaq';
import { getProps } from 'lib/getProps';
import { GateActiveUser, GateLoaded, GateNodeOperator } from 'shared/gates';
import { Navigate } from 'shared/navigate';

const Page = () => (
  <GateLoaded fallback={<SplashPage />}>
    <GateActiveUser
      fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
    >
      <GateNodeOperator
        fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
      >
        <ClaimBondPage />
      </GateNodeOperator>
    </GateActiveUser>
  </GateLoaded>
);

export default Page;

export const getServerSideProps = getProps(getFaqBond);
