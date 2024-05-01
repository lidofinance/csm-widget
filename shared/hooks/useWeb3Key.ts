import { config } from 'config';
import { useAccount } from './use-account';

// In order to simplify side effects of switching wallets/chains
// we can remount by this key, resetting all internal states
export const useWeb3Key = () => {
  const { address, chainId } = useAccount();
  return `${address ?? 'NO_ACCOUNT'}_${chainId ?? config.defaultChain}`;
};
