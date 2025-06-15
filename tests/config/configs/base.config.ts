import {
  METAMASK_COMMON_CONFIG,
  NetworkConfig,
  WalletConfig,
} from '@lidofinance/wallets-testing-wallets';
import { CSAccounting__factory } from 'generated';
import { z } from 'zod';

export type StandConfig = {
  standType: string;
  standUrl: string;
  networkConfig: NetworkConfig;
};

export type ContractInfo = {
  address: string;
  abi: typeof CSAccounting__factory.abi;
};

export interface IConfig {
  standConfig: StandConfig;
  walletConfig: WalletConfig;
  contracts: Record<string, ContractInfo>;
  getFullInfo(): string;
}

export const ConfigSchema = z.object({
  standType: z.string(),
  standUrl: z.string().url(),
});

export class BaseConfig implements IConfig {
  public standConfig!: StandConfig;
  public walletConfig: WalletConfig;
  public contracts!: Record<string, ContractInfo>;

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
