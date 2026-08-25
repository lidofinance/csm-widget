import { BaseConfig } from './base.config';

export class ProdConfig extends BaseConfig {
  constructor() {
    super();

    this.standConfig = {
      standType: 'prod',
      standUrl: 'https://cm.lido.fi',
      matomoUrl: 'https://matomo.lido.fi/matomo.php',
      networkConfig: {
        chainId: 1,
        tokenSymbol: 'ETH',
        chainName: 'Ethereum Mainnet',
        rpcUrl: this.getRpcUrl('prod'),
        scan: 'https://etherscan.io/',
      },
      nodeConfig: {
        mockConfig: {
          mockEnabled: true,
          rpcUrlToMock: [`.*/api/rpc\\?chainId=1`],
        },
        rpcUrl: this.getRpcUrl('prod'),
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
        chain: 'mainnet',
        withdrawalCredentials: '0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f',
        password: 'testtest',
      },
      justConfig: {
        chain: 'mainnet',
        deployConfig: './artifacts/mainnet/curated/deploy-mainnet.json',
        artifactsDir: './artifacts/mainnet',
      },
      ipfsConfig: {
        gateway:
          (process.env.IPFS_GATEWAY as `${string}/ipfs/`) ||
          'http://127.0.0.1:8080/ipfs/',
      },
    };

    this.linkTargets = {
      csmLink: 'https://csm.lido.fi/',
      operatorsLidoLink: 'https://operators.lido.fi',
    };
  }
}
