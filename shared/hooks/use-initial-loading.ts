import { useEffect } from 'react';
import { useCsmStatus, useDappStatus } from 'modules/web3';
import { useNodeOperator } from 'modules/web3/operator-provider';
import { useAvailableOperators } from 'modules/web3/operator-provider/use-available-operators';
import { useAccount } from 'wagmi';

export const useInitialLoading = (externalLoading?: boolean) => {
  const { isConnecting } = useAccount();
  const { isAccountActive } = useDappStatus();
  const { isPending: isStatusLoading, error: statusError } = useCsmStatus();
  const { isPending: isOperatorsLoading } = useNodeOperator();
  const { error: operatorsError } = useAvailableOperators();

  useEffect(() => {
    if (statusError) {
      console.warn('CSM status loading error:', statusError);
    }
  }, [statusError]);

  useEffect(() => {
    if (operatorsError) {
      console.warn('Node operators loading error:', operatorsError);
    }
  }, [operatorsError]);

  return [
    isConnecting,
    isStatusLoading,
    isAccountActive && isOperatorsLoading,
    externalLoading,
  ].some((i) => i === true);
};
