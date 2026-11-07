import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

export type UserConfigDefaultType = {
  defaultChain: SUPPORTED_CHAINS;
  walletconnectProjectId: string | undefined;
  defaultIpfsGateways: string[];
};
