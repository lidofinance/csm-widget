import { PATH } from 'consts/urls';
import { StealingReportPage } from 'features/stealing';
import { SplashPage } from 'features/welcome';
import { getProps } from 'lib/getProps';
import { GateActiveUser, GateLoaded } from 'shared/gates';
import { useIsReportStealingRole } from 'shared/hooks';
import { Navigate } from 'shared/navigate';

const Page = () => {
  const { data: isReportingRole, initialLoading } = useIsReportStealingRole();

  return (
    <GateLoaded fallback={<SplashPage />}>
      <GateActiveUser
        fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
      >
        {initialLoading ? (
          <SplashPage />
        ) : isReportingRole ? (
          <StealingReportPage />
        ) : (
          <Navigate path={PATH.HOME} fallback={<SplashPage />} />
        )}
      </GateActiveUser>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
