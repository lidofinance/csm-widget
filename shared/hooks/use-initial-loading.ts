import { useCsmStatus, useDappStatus } from 'modules/web3';
import { useNodeOperator } from 'modules/web3/operator-provider';
import { useAccount } from 'wagmi';

export const useInitialLoading = (externalLoading?: boolean) => {
  const { isConnecting } = useAccount();
  const { isAccountActive } = useDappStatus();
  const { isPending: isStatusLoading } = useCsmStatus();
  const { isPending: isOperatorsLoading } = useNodeOperator();

  // TODO: handle loading errors
  // TODO: handle status.isError || list.isError

  return [
    isConnecting,
    isStatusLoading,
    isAccountActive && isOperatorsLoading,
    externalLoading,
  ].some((i) => i === true);
};
