import { PATH } from 'consts/urls';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { useHasProtocolRole } from 'modules/web3';

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
            <Navigate path={PATH.DELAYED_PENALTY_REPORT} />
          </Gate>
        </GateLoaded>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
