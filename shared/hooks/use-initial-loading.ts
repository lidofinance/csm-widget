import { useCsmStatus, useCsmVersionSupported } from 'modules/web3';
import { useAvailableOperators } from 'modules/web3/operator-provider';
import { useAccount } from 'wagmi';

export const useInitialLoading = (externalLoading?: boolean) => {
  const { isConnecting } = useAccount();
  const { isLoading: isStatusLoading } = useCsmStatus();
  const { isPending: isOperatorsLoading } = useAvailableOperators();
  const { isPending: isSupportedLoading } = useCsmVersionSupported();

  // TODO: handle loading errors
  // TODO: handle status.isError || list.isError

  // FIXME: useEffect ??

  return [
    isStatusLoading,
    isSupportedLoading,
    isConnecting,
    isOperatorsLoading,
    externalLoading,
  ].every((i) => i === false);
};
