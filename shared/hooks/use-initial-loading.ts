import { useCsmStatus, useCsmVersionSupported } from 'modules/web3';
import { useAvailableOperators } from 'modules/web3/operator-provider';
import { useAccount } from 'wagmi';

export const useInitialLoading = (externalLoading?: boolean) => {
  const { isConnecting } = useAccount();
  const { isPending: isStatusLoading } = useCsmStatus();
  const { isPending: isSupportedLoading } = useCsmVersionSupported();
  const { isPending: isOperatorsLoading } = useAvailableOperators();

  // TODO: handle loading errors
  // TODO: handle status.isError || list.isError

  // FIXME: useEffect ??

  return [
    isConnecting,
    isStatusLoading,
    isSupportedLoading,
    isOperatorsLoading,
    externalLoading,
  ].some((i) => i === true);
};
