import { useCsmStatus } from 'modules/web3';
import { useAvailableOperators } from 'modules/web3/operator-provider';
import { useAccount } from 'wagmi';

export const useInitialLoading = (externalLoading?: boolean) => {
  const { isConnecting } = useAccount();
  const { isPending: isStatusLoading } = useCsmStatus();
  const { isPending: isOperatorsLoading } = useAvailableOperators();

  // TODO: handle loading errors
  // TODO: handle status.isError || list.isError

  // FIXME: useEffect ??

  return [
    isConnecting,
    isStatusLoading,
    isOperatorsLoading,
    externalLoading,
  ].some((i) => i === true);
};
