import { BaseConfig } from './base.config';

export class TestnetConfig extends BaseConfig {
  constructor() {
    super();
    this.standConfig = {
      standType: 'testnet',
      standUrl: 'https://csm.testnet.fi/',
      networkConfig: {
        chainId: 560048,
        tokenSymbol: 'ETH',
        chainName: 'Hoodi',
        rpcUrl:
          process.env.RPC_URL ||
          `https://lb.drpc.org/ogrpc?network=hoodi&dkey=${process.env.RPC_URL_TOKEN}`,
        scan: 'https://hoodi.etherscan.io/',
      },
    };
  }
}
