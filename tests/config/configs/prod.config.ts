import { BaseConfig } from './base.config';

export class ProdConfig extends BaseConfig {
  constructor() {
    super();

    this.standConfig = {
      standType: 'prod',
      standUrl: 'https://csm.lido.fi',
      matomoUrl: 'https://matomo.lido.fi/matomo.php',
      networkConfig: {
        chainId: 1,
        tokenSymbol: 'ETH',
        chainName: 'Ethereum Mainnet',
        rpcUrl: process.env.RPC_URL as string,
        scan: 'https://etherscan.io/',
      },
      nodeConfig: {
        rpcUrlToMock: `**/api/rpc?chainId=1`,
        rpcUrl: process.env.RPC_URL as string,
        derivationPath: "m/44'/60'/0'/0",
        host: '127.0.0.1',
        port: 8545,
      },
    };
  }
}
