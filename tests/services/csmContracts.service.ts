import { widgetFullConfig } from 'tests/config';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

export class CSAccountingContract {
  private contractName: string;
  private contract: Contract;

  constructor() {
    this.contractName = 'CSAccounting';
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

  async getBondSummary(nodeOperatorNumber: number) {
    return this.contract.getBondSummary(nodeOperatorNumber);
  }
}
