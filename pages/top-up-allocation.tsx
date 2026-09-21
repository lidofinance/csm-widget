import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { TopUpAllocationPage } from 'features/top-up-allocation';
import {
  useHasProtocolRole,
  useIsTopUpAllocationSupported,
  useSmSDK,
} from 'modules/web3';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => {
  const cmSdk = useSmSDK(MODULE_NAME.CM);
  const { isPending: isRolePending } = useHasProtocolRole(
    'ENABLE_TOP_UP_ALLOCATION_ROLE',
    MODULE_NAME.CM,
  );
  const { isPending: isSupportedPending } = useIsTopUpAllocationSupported();

  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<Navigate path={PATH.HOME} />}>
        <GateLoaded
          additional={!!cmSdk && (isRolePending || isSupportedPending)}
        >
          <Gate
            rule="EL_TOP_UP_ALLOCATION_ENABLER"
            fallback={<Navigate path={PATH.HOME} />}
          >
            <TopUpAllocationPage />
          </Gate>
        </GateLoaded>
      </Gate>
    </GateLoaded>
  );
};

export default Page;
