import { BaseConfig } from './base.config';

export class TestnetConfig extends BaseConfig {
  constructor() {
    super();

    this.standConfig = {
      standType: 'testnet',
      standUrl: 'https://csm.testnet.fi/',
      matomoUrl: 'https://matomo.testnet.fi/matomo.php',
      stakeWidgetUrl: 'https://stake-hoodi.testnet.fi',
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
      },
      mockConfig: {
        urls: {
          csmSurveysApi: 'https://csm-survey-api-hoodi.lido.tools',
        },
      },
      monitoringConfig: {
        urls: {
          beaconchain: 'https://hoodi.beaconcha.in',
          operators: 'https://operators-hoodi.testnet.fi',
          feesMonitoring: 'https://fees-monitoring-hoodi.testnet.fi',
          csmSentinel: 'https://github.com/skhomuti/csm-sentinel',
        },
        stakingModuleIndex: 4,
      },
      keysGeneratorConfig: {
        chain: 'hoodi',
        withdrawalCredentials: '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
        password: 'testtest',
      },
      justConfig: {
        chain: 'hoodi',
        deployConfig: './artifacts/hoodi/csm/upgrade-v3-hoodi.json',
        artifactsDir: './artifacts/hoodi',
      },
    };
  }
}
