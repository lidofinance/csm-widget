import { PATH } from 'consts/urls';
import { DkgFilesPage } from 'features/idvtc/dkg';
import { useNodeOperator } from 'modules/web3/operator-provider/node-operator-provider';
import { useOperatorType } from 'modules/web3/hooks/use-operator-type';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => {
  const { nodeOperator } = useNodeOperator();
  const { isPending } = useOperatorType(nodeOperator);

  return (
    <GateLoaded>
      <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.CREATE} />}>
        <GateLoaded additional={isPending}>
          <Gate rule="IS_IDVTC" fallback={<Navigate path={PATH.HOME} />}>
            <DkgFilesPage />
          </Gate>
        </GateLoaded>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
