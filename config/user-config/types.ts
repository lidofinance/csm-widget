import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export type UserConfigDefaultType = {
  defaultChain: number;
  supportedChainIds: number[];
  prefillUnsafeElRpcUrls: {
    [CHAINS.Mainnet]: string[];
    [CHAINS.Holesky]: string[];
    [CHAINS.Hoodi]: string[];
  };
  walletconnectProjectId: string | undefined;
};
