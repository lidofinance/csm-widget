// StagingConfig.ts
import { BaseConfig } from './base.config';

export class StagingConfig extends BaseConfig {
  constructor() {
    super();
    this.standConfig = {
      standType: 'staging',
      standUrl: 'https://csm.infra-staging.org',
      networkConfig: {
        chainId: 1,
        tokenSymbol: 'ETH',
        chainName: 'Ethereum Mainnet',
        rpcUrl:
          process.env.RPC_URL ||
          `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${process.env.RPC_URL_TOKEN}`,
        scan: 'https://etherscan.io/',
      },
    };
  }
}
