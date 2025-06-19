import {
  CSAccounting__factory,
  CSFeeOracle__factory,
  HashConsensus__factory,
} from 'generated';
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
      CSFeeOracle: {
        address: '0xe7314f561B2e72f9543F1004e741bab6Fc51028B',
        abi: CSFeeOracle__factory.abi,
      },
      HashConsensus: {
        address: '0x54f74a10e4397dDeF85C4854d9dfcA129D72C637',
        abi: HashConsensus__factory.abi,
      },
    };
  }
}
