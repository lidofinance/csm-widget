import { config } from 'config';
import { useDappStatus, useModule, useNodeOperatorId } from 'modules/web3';

// In order to simplify side effects of switching wallets/chains
// we can remount by this key, resetting all internal states
export const useWeb3Key = () => {
  const { address, chainId } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { module } = useModule();
  return `${address ?? 'NO_ACCOUNT'}_${module ?? 'NO_MODULE'}_${nodeOperatorId ?? 'NO_ID'}_${chainId ?? config.defaultChain}`;
};
