import { widgetFullConfig } from 'tests/config';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

export class BaseContractClient {
  protected contractName: string;
  protected contract: Contract;

  constructor(contractName: string) {
    this.contractName = contractName;
    const provider = new JsonRpcProvider(
      widgetFullConfig.standConfig.networkConfig.rpcUrl,
    );

    const contractInfo = widgetFullConfig.contracts[this.contractName];

    this.contract = new Contract(
      contractInfo.address,
      contractInfo.abi,
      provider,
    );
  }
}
