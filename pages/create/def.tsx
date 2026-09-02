import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { CreateOperatorPage } from 'features/create-node-operator';
import { useCanCreateNodeOperator } from 'shared/hooks';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => {
  const { isPending } = useCanCreateNodeOperator();

  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<Navigate path={PATH.HOME} />}>
        <Gate rule="IS_CSM_FAMILY" fallback={<Navigate path={PATH.CREATE} />}>
          <GateLoaded additional={isPending}>
            <Gate
              rule="CAN_CREATE_DEF"
              fallback={<Navigate path={PATH.CREATE} />}
            >
              <CreateOperatorPage type={OPERATOR_TYPE.CSM_DEF} />
            </Gate>
          </GateLoaded>
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
