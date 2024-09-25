import { PATH } from 'consts/urls';
import { StealingReportPage } from 'features/stealing';
import { SplashPage } from 'features/welcome';
import { getProps } from 'lib/getProps';
import { GateActiveUser, GateLoaded } from 'shared/gates';
import { useAddressCompare, useReportStealingRoleAddress } from 'shared/hooks';
import { Navigate } from 'shared/navigate';

const Page = () => {
  const isUserAddress = useAddressCompare();
  const { data: reportingAddress, initialLoading } =
    useReportStealingRoleAddress();

  return (
    <GateLoaded fallback={<SplashPage />}>
      <GateActiveUser
        fallback={<Navigate path={PATH.HOME} fallback={<SplashPage />} />}
      >
        {initialLoading ? (
          <SplashPage />
        ) : isUserAddress(reportingAddress) ? (
          <StealingReportPage />
        ) : (
          <Navigate path={PATH.HOME} fallback={<SplashPage />} />
        )}
      </GateActiveUser>
    </GateLoaded>
  );
};

export default Page;

export const getStaticProps = getProps();
