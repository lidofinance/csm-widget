import { EthereumNodeServiceOptions } from '@lidofinance/wallets-testing-nodes';
import {
  NetworkConfig,
  CommonWalletConfig,
  AccountConfig,
  METAMASK_STABLE_COMMON_CONFIG,
} from '@lidofinance/wallets-testing-wallets';

import { z } from 'zod';

export type StandConfig = {
  standType: string;
  standUrl: string;
  networkConfig: NetworkConfig;
  nodeConfig: EthereumNodeServiceOptions;
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
    this.walletConfig = METAMASK_STABLE_COMMON_CONFIG;
  }

  getFullInfo(): string {
    throw new Error('Method not implemented.');
  }
}
