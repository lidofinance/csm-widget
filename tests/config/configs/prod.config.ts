import { BaseConfig } from './base.config';

export class ProdConfig extends BaseConfig {
  constructor() {
    super();

    this.standConfig = {
      standType: 'prod',
      standUrl: 'https://csm.lido.fi',
      networkConfig: {
        chainId: 1,
        tokenSymbol: 'ETH',
        chainName: 'Ethereum Mainnet',
        rpcUrl: `https://lb.drpc.org/ogrpc?network=ethereum&dkey=${process.env.RPC_URL_TOKEN}`,
        scan: 'https://etherscan.io/',
      },
    };
  }
}
