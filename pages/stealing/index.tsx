import { PATH } from 'consts/urls';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { useHasReportStealingRole } from 'modules/web3';

const Page = () => {
  const { isPending } = useHasReportStealingRole();

  return (
    <GateLoaded additional={isPending}>
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
