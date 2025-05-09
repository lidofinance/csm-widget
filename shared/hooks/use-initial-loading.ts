import { useCsmStatus, useEarlyAdoptionAccountProof } from 'modules/web3';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useAccount } from './use-account';

export const useInitialLoading = (externalLoading?: boolean) => {
  const { isConnecting } = useAccount();
  const { isLoading: isStatusLoading } = useCsmStatus();
  const { isLoading: isEALoading } = useEarlyAdoptionAccountProof();
  const { isListLoading, active } = useNodeOperatorContext();

  // TODO: handle status.isError || eaProof.isError || list.isError

  const loading =
    isStatusLoading ||
    isConnecting ||
    isListLoading ||
    (!active && isEALoading);

  return loading || externalLoading;
};
