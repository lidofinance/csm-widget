import { BaseConfig } from './base.config';

export class TestnetConfig extends BaseConfig {
  constructor() {
    super();
    this.standConfig = {
      standType: 'testnet',
      standUrl: 'https://csm.testnet.fi/',
      matomoUrl: 'https://matomo.testnet.fi/matomo.php',
      networkConfig: {
        chainId: 560048,
        tokenSymbol: 'ETH',
        chainName: 'Hoodi',
        rpcUrl: process.env.RPC_URL as string,
        scan: 'https://hoodi.etherscan.io/',
      },
      nodeConfig: {
        rpcUrlToMock: `**/api/rpc?chainId=560048`,
        rpcUrl: process.env.RPC_URL as string,
        derivationPath: "m/44'/60'/0'/0",
        host: '127.0.0.1',
        port: 8545,
      },
      mockConfig: {
        urls: {
          csmSurveysApi: 'https://csm-surveys-api-testnet.up.railway.app',
        },
      },
    };
  }
}
