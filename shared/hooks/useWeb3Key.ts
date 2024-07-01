import { config } from 'config';
import { useAccount } from './use-account';
import { useNodeOperatorId } from 'providers/node-operator-provider';

// In order to simplify side effects of switching wallets/chains
// we can remount by this key, resetting all internal states
export const useWeb3Key = () => {
  const { address, chainId } = useAccount();
  const nodeOperatorId = useNodeOperatorId();
  return `${address ?? 'NO_ACCOUNT'}_${nodeOperatorId ?? 'NO_ID'}_${chainId ?? config.defaultChain}`;
};
