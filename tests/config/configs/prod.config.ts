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
        rpcUrl: process.env.RPC_URL as string,
        scan: 'https://etherscan.io/',
      },
    };
  }
}
