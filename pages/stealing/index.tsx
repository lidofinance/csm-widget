import { PATH } from 'consts/urls';
import { getProps } from 'lib/getProps';
import { useIsReportStealingRole } from 'shared/hooks';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => {
  const { initialLoading } = useIsReportStealingRole();

  return (
    <GateLoaded additional={initialLoading}>
      <Gate
        rule="EL_STEALING_REPORTER"
        fallback={<Navigate path={PATH.HOME} />}
      >
        <Navigate path={PATH.STEALING_REPORT} />
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
