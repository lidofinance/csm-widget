import { EthereumNodeServiceOptions } from '@lidofinance/wallets-testing-nodes';
import {
  NetworkConfig,
  CommonWalletConfig,
  AccountConfig,
  WC_SDK_COMMON_CONFIG,
} from '@lidofinance/wallets-testing-wallets';

import { z } from 'zod';

export type KeysGeneratorConfig = {
  chain: string;
  withdrawalCredentials: string;
  password: string;
};

export type JustConfig = {
  chain: NonNullable<NodeJS.ProcessEnv['CHAIN']>;
  deployConfig: string;
  artifactsDir: string;
};

export type StandConfig = {
  standType: string;
  standUrl: string;
  networkConfig: NetworkConfig;
  nodeConfig: EthereumNodeServiceOptions & {
    host: string;
  };
  matomoUrl: string;
  keysGeneratorConfig: KeysGeneratorConfig;
  mockConfig?: {
    urls: {
      csmSurveysApi: string;
    };
  };
  monitoringConfig: {
    urls: {
      beaconchain: string;
      operators: string;
      feesMonitoring: string;
      csmSentinel: string;
      beaconchainEntity?: string;
      rated?: string;
      migaLabs?: string;
    };
    stakingModuleIndex: number;
  };
  justConfig: JustConfig;
};

export type IConfig = {
  standConfig: StandConfig;
  walletConfig: CommonWalletConfig;
  accountConfig: AccountConfig;
  getFullInfo(): string;
};

export const rpcUrlByStandType: Record<string, string> = {
  prod: `https://lb.drpc.org/ogrpc?network=ethereum`,
  testnet: `https://lb.drpc.org/ogrpc?network=hoodi`,
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

  getRpcUrl(standType: string): string {
    if (process.env.RPC_URL && process.env.RPC_URL_TOKEN) {
      throw new Error(
        'Both RPC_URL and RPC_URL_TOKEN are defined in the environment variables. Please define only one of them.',
      );
    }

    if (process.env.RPC_URL) {
      return process.env.RPC_URL;
    }

    if (!process.env.RPC_URL_TOKEN) {
      throw new Error(
        'RPC_URL_TOKEN is not defined in the environment variables.',
      );
    }

    const rpcUrl = rpcUrlByStandType[standType];
    if (!rpcUrl) {
      throw new Error(`No default RPC URL found for stand type: ${standType}`);
    }

    return `${rpcUrl}&dkey=${process.env.RPC_URL_TOKEN}`;
  }
}
