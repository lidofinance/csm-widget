import { PATH } from 'consts/urls';
import { DelayedPenaltyReportPage } from 'features/delayed-penalty';
import { useHasProtocolRole } from 'modules/web3';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => {
  const { isPending } = useHasProtocolRole(
    'REPORT_GENERAL_DELAYED_PENALTY_ROLE',
  );

  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<Navigate path={PATH.HOME} />}>
        <GateLoaded additional={isPending}>
          <Gate
            rule="EL_DELAYED_PENALTY_REPORTER"
            fallback={<Navigate path={PATH.HOME} />}
          >
            <DelayedPenaltyReportPage />
          </Gate>
        </GateLoaded>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
