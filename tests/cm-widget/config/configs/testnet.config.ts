import { BaseConfig } from './base.config';

export class TestnetConfig extends BaseConfig {
  constructor() {
    super();

    this.standConfig = {
      standType: 'testnet',
      standUrl: 'https://cm.testnet.fi/',
      matomoUrl: 'https://matomo.testnet.fi/matomo.php',
      networkConfig: {
        chainId: 560048,
        tokenSymbol: 'ETH',
        chainName: 'Hoodi',
        rpcUrl: this.getRpcUrl('testnet'),
        scan: 'https://hoodi.etherscan.io/',
      },
      nodeConfig: {
        mockConfig: {
          mockEnabled: true,
          rpcUrlToMock: [`.*/api/rpc\\?chainId=560048`],
        },
        rpcUrl: this.getRpcUrl('testnet'),
        derivationPath: "m/44'/60'/0'/0",
        host: '127.0.0.1',
        port: process.env.ANVIL_PORT ? parseInt(process.env.ANVIL_PORT) : 8545,
        forkLog: {
          enabled: false,
          logToFile: true,
          logToConsole: false,
        },
      },
      keysGeneratorConfig: {
        chain: 'hoodi',
        withdrawalCredentials: '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
        password: 'testtest',
      },
      justConfig: {
        chain: 'hoodi',
        deployConfig: './artifacts/hoodi/curated/deploy-hoodi.json',
        artifactsDir: './artifacts/hoodi',
      },
    };
    this.linkTargets = {
      csmLink: 'https://csm.testnet.fi/',
      operatorsLidoLink: 'https://operators-hoodi.testnet.fi',
    };
  }
}
