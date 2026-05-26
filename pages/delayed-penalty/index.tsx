import { PATH } from 'consts/urls';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { useHasReportDelayedPenaltyRole } from 'modules/web3';

const Page = () => {
  const { isPending } = useHasReportDelayedPenaltyRole();

  return (
    <GateLoaded additional={isPending}>
      <Gate rule="IS_CSM" fallback={<Navigate path={PATH.HOME} />}>
        <Gate
          rule="EL_DELAYED_PENALTY_REPORTER"
          fallback={<Navigate path={PATH.HOME} />}
        >
          <Navigate path={PATH.DELAYED_PENALTY_REPORT} />
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
