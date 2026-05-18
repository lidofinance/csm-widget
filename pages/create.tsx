import { PATH } from 'consts/urls';
import { CreateNodeOperatorPage } from 'features/create-node-operator';
import { getProps } from 'utilsApi';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import {
  useCuratedGatesEligibility,
  useIcsProof,
  useIdvtcProof,
} from 'modules/web3';
import { isModuleCSM } from 'consts';

const Page = () => {
  const { isPending: isPendingCM } = useCuratedGatesEligibility();
  const { isPending: isPendingICS } = useIcsProof();
  const { isPending: isPendingIDVTC } = useIdvtcProof();
  const isPendingCSM = isPendingICS || isPendingIDVTC;
  const isPending = isModuleCSM ? isPendingCSM : isPendingCM;

  return (
    <GateLoaded additional={isPending}>
      <Gate
        rule={'IS_CONNECTED_WALLET'}
        fallback={<Navigate path={PATH.HOME} />}
      >
        <Gate rule={'CAN_CREATE'} fallback={<Navigate path={PATH.HOME} />}>
          <CreateNodeOperatorPage />
        </Gate>
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
