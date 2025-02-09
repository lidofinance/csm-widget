import { useCsmStatus } from 'modules/web3';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useAccount } from './use-account';
import { useEffect, useState } from 'react';
import { useCsmVersionSupported } from './use-csm-version-supported';

type ReturnProps = { isLoading: boolean; isSupported: boolean };

export const useInitialLoading = (externalLoading?: boolean) => {
  const { isConnecting } = useAccount();
  const { isLoading: isStatusLoading } = useCsmStatus();
  const { isListLoading, active } = useNodeOperatorContext();
  const { initialLoading: isSupporetdLoading, data: isSupported } =
    useCsmVersionSupported();

  // TODO: handle status.isError || list.isError

  const [state, setState] = useState<ReturnProps>({
    isLoading: true,
    isSupported: true,
  });

  useEffect(() => {
    const isLoading = isStatusLoading || isConnecting || isListLoading;

    const result = Boolean(isLoading || externalLoading);
    setState({ isLoading, isSupported: isSupported ?? true });
  }, [active, externalLoading, isConnecting, isListLoading, isStatusLoading]);

  return state;
};
