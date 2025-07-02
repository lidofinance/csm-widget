import {
  METAMASK_COMMON_CONFIG,
  NetworkConfig,
  CommonWalletConfig,
  AccountConfig,
} from '@lidofinance/wallets-testing-wallets';
import {
  CSAccounting__factory,
  CSFeeOracle__factory,
  HashConsensus__factory,
} from 'generated';
import { z } from 'zod';

export type StandConfig = {
  standType: string;
  standUrl: string;
  networkConfig: NetworkConfig;
};

export type ContractInfo = {
  address: string;
  abi:
    | typeof CSAccounting__factory.abi
    | typeof CSFeeOracle__factory.abi
    | typeof HashConsensus__factory.abi;
};

export interface IConfig {
  standConfig: StandConfig;
  walletConfig: CommonWalletConfig;
  accountConfig: AccountConfig;
  contracts: Record<string, ContractInfo>;
  getFullInfo(): string;
}

export const ConfigSchema = z.object({
  standType: z.string(),
  standUrl: z.string().url(),
});

export class BaseConfig implements IConfig {
  public standConfig!: StandConfig;
  public walletConfig: CommonWalletConfig;
  public accountConfig: AccountConfig;
  public contracts!: Record<string, ContractInfo>;

  constructor() {
    this.accountConfig = {
      SECRET_PHRASE: process.env.WALLET_SECRET_PHRASE || '',
      PASSWORD: process.env.WALLET_PASSWORD || '',
    };
    this.walletConfig = METAMASK_COMMON_CONFIG;
  }

  getFullInfo(): string {
    throw new Error('Method not implemented.');
  }
}
