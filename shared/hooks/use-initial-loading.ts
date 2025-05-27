import { useCsmStatus, useCsmVersionSupported } from 'modules/web3';
import { useAvailableOperators } from 'modules/web3/operator-provider';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

type ReturnProps = { isLoading: boolean; isSupported: boolean };

export const useInitialLoading = (externalLoading?: boolean) => {
  const { isConnecting } = useAccount();
  const { isLoading: isStatusLoading } = useCsmStatus();
  const { isPending: isOperatorsLoading } = useAvailableOperators();
  const { isPending: isSupportedLoading, data: isSupported } =
    useCsmVersionSupported();

  const [state, setState] = useState<ReturnProps>({
    isLoading: true,
    isSupported: true,
  });

  // TODO: handle loading errors
  // TODO: handle status.isError || list.isError

  useEffect(() => {
    const loaders = [
      isStatusLoading,
      isSupportedLoading,
      isConnecting,
      isOperatorsLoading,
      externalLoading,
    ];

    const isLoading = loaders.every((i) => i === false);

    setState({ isLoading, isSupported: isSupported ?? true });
  }, [
    externalLoading,
    isConnecting,
    isOperatorsLoading,
    isStatusLoading,
    isSupported,
    isSupportedLoading,
  ]);

  return state;
};
