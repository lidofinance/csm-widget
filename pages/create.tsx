import { PATH } from 'consts/urls';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { useCuratedGatesEligibility, useIcsProof } from 'modules/web3';
import { isModuleCSM } from 'consts';

const Page = () => {
  const { isPending: isPendingCM } = useCuratedGatesEligibility();
  const { isPending: isPendingCSM } = useIcsProof(); // TODO: add dvt
  const isPending = isModuleCSM ? isPendingCSM : isPendingCM;

  return (
    <GateLoaded>
      <Gate
        rule={'IS_CONNECTED_WALLET'}
        fallback={<Navigate path={PATH.HOME} />}
      >
        <GateLoaded additional={isPending}>
          <Gate rule={'CAN_CREATE'} fallback={<Navigate path={PATH.HOME} />}>
            <CreateNodeOperatorPage />
          </Gate>
        </GateLoaded>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
