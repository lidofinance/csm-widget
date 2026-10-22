import { PATH } from 'consts/urls';
import { GeneralPage } from 'features/general';
import { useIsTopUpAllocationSupported } from 'modules/web3';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => {
  const { isLoading } = useIsTopUpAllocationSupported();

  return (
    <GateLoaded additional={isLoading}>
      <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
        <Gate rule="CAN_TOGGLE_TOP_UP" fallback={<Navigate path={PATH.HOME} />}>
          <GeneralPage />
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
