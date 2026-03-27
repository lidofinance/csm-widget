import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export type UserConfigDefaultType = {
  defaultChain: SUPPORTED_CHAINS;
  prefillUnsafeElRpcUrls: {
    [CHAINS.Mainnet]: string[];
    [CHAINS.Hoodi]: string[];
  };
  walletconnectProjectId: string | undefined;
};
