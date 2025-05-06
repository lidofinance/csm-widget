import {
  METAMASK_COMMON_CONFIG,
  NetworkConfig,
  WalletConfig,
} from '@lidofinance/wallets-testing-wallets';
import { z } from 'zod';

export type StandConfig = {
  standType: string;
  standUrl: string;
  networkConfig: NetworkConfig;
};

export interface IConfig {
  standConfig: StandConfig;
  walletConfig: WalletConfig;
  getFullInfo(): string;
}

export const ConfigSchema = z.object({
  standType: z.string(),
  standUrl: z.string().url(),
});

export class BaseConfig implements IConfig {
  public standConfig!: StandConfig;
  public walletConfig: WalletConfig;

  constructor() {
    this.walletConfig = {
      SECRET_PHRASE: process.env.WALLET_SECRET_PHRASE || '',
      PASSWORD: process.env.WALLET_PASSWORD || '',
      COMMON: METAMASK_COMMON_CONFIG,
    };
  }

  getFullInfo(): string {
    throw new Error('Method not implemented.');
  }
}
