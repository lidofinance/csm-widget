import { BaseConfig } from './base.config';

export class TestnetConfig extends BaseConfig {
  constructor() {
    super();
    this.standConfig = {
      standType: 'testnet',
      standUrl: 'https://csm-hoodi.vercel.app/create',
      networkConfig: {
        chainId: 560048,
        tokenSymbol: 'ETH',
        chainName: 'Hoodi',
        rpcUrl: `https://lb.drpc.org/ogrpc?network=hoodi&dkey=${process.env.RPC_URL_TOKEN}`,
        scan: 'https://hoodi.etherscan.io/',
      },
    };
  }
}
