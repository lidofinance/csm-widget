import { PATH } from 'consts/urls';
import { DelayedPenaltyReportPage } from 'features/delayed-penalty';
import { useHasReportDelayedPenaltyRole } from 'modules/web3';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => {
  const { isPending } = useHasReportDelayedPenaltyRole();

  return (
    <GateLoaded additional={isPending}>
      <Gate
        rule="EL_DELAYED_PENALTY_REPORTER"
        fallback={<Navigate path={PATH.HOME} />}
      >
        <DelayedPenaltyReportPage />
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
