import { PATH } from 'consts/urls';
import { CreateFlow } from 'features/create-node-operator';
import { useCanCreateNodeOperator } from 'shared/hooks';
import { Gate, GateLoaded, Navigate, useCorrectPath } from 'shared/navigate';

const CreateIndex = () => {
  const correctPath = useCorrectPath(PATH.CREATE);

  // A hard load skips LocalLink correction: role holders that cannot create go to /keys, CM-only wallets to /create/cm
  if (correctPath !== PATH.CREATE)
    return <Navigate replace path={correctPath} />;

  return (
    <Gate rule="CAN_CREATE" fallback={<Navigate replace path={PATH.HOME} />}>
      <CreateFlow />
    </Gate>
  );
};

const Page = () => {
  const { isPending } = useCanCreateNodeOperator();

  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<Navigate path={PATH.HOME} />}>
        <GateLoaded additional={isPending}>
          <CreateIndex />
        </GateLoaded>
      </Gate>
    </GateLoaded>
  );
};

export default Page;
