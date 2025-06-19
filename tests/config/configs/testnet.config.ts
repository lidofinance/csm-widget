import { CSAccounting__factory } from 'generated';
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
        rpcUrl: process.env.RPC_URL as string,
        scan: 'https://hoodi.etherscan.io/',
      },
    };
    this.contracts = {
      CSAccounting: {
        address: '0xa54b90ba34c5f326bc1485054080994e38fb4c60',
        abi: CSAccounting__factory.abi,
      },
    };
  }
}
