import { PATH } from 'consts/urls';
import { deployedModules, isCsmFamilyModule } from 'consts/modules';
import {
  CreateNodeOperatorPage,
  SelectTypePage,
} from 'features/create-node-operator';
import { useCanCreateNodeOperator } from 'shared/hooks';
import { Gate, GateLoaded, Navigate, useCorrectPath } from 'shared/navigate';
import { getProps } from 'utilsApi';

// Only a CSM-family deployment has multiple types to choose between. Branch on
// this build-time deployment fact, not the active-module show rule — a
// mismatch would render the wrong module's form.
const CreateIndex = () => {
  const correctPath = useCorrectPath(PATH.CREATE);

  if (!deployedModules.some(isCsmFamilyModule))
    return <CreateNodeOperatorPage />;
  // A hard load of /create bypasses the LocalLink/useNavigate redirect, so
  // send a wallet with exactly one creatable type straight to it here too.
  if (correctPath !== PATH.CREATE) return <Navigate path={correctPath} />;
  return <SelectTypePage />;
};

const Page = () => {
  const { isPending } = useCanCreateNodeOperator();

  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<Navigate path={PATH.HOME} />}>
        <GateLoaded additional={isPending}>
          <Gate rule="CAN_CREATE" fallback={<Navigate path={PATH.HOME} />}>
            <CreateIndex />
          </Gate>
        </GateLoaded>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
