import { EthereumNodeServiceOptions } from '@lidofinance/wallets-testing-nodes';
import {
  NetworkConfig,
  CommonWalletConfig,
  AccountConfig,
  WC_SDK_COMMON_CONFIG,
} from '@lidofinance/wallets-testing-wallets';

import { z } from 'zod';

export type MockConfig = {
  clHost: string;
  clPort: number;
  /** real testnet CL base URL the cl-mock proxies to on miss (from CL_API_URLS_* server env). */
  clUpstreamUrl?: string;
  clUrlToMock: string[];
  ipfsHost: string;
  ipfsPort: number;
  /** real upstream IPFS gateway the ipfs-mock proxies to on miss. */
  ipfsUpstreamGateway?: string;
};

export type StandConfig = {
  standType: string;
  standUrl: string;
  networkConfig: NetworkConfig;
  nodeConfig: EthereumNodeServiceOptions & {
    host: string;
  };
  matomoUrl: string;
  mockConfig: MockConfig;
};

export type IConfig = {
  standConfig: StandConfig;
  walletConfig: CommonWalletConfig;
  accountConfig: AccountConfig;
  getFullInfo(): string;
};

export const ConfigSchema = z.object({
  standType: z.string(),
  standUrl: z.string().url(),
});

export class BaseConfig implements IConfig {
  public standConfig!: StandConfig;
  public walletConfig: CommonWalletConfig;
  public accountConfig: AccountConfig;

  constructor() {
    this.accountConfig = {
      SECRET_PHRASE: process.env.WALLET_SECRET_PHRASE || '',
      PASSWORD: process.env.WALLET_PASSWORD || '',
    };
    this.walletConfig = WC_SDK_COMMON_CONFIG;
  }

  getFullInfo(): string {
    throw new Error('Method not implemented.');
  }
}
