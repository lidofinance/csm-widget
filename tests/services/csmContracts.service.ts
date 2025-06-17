import { widgetFullConfig } from 'tests/config';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { test } from '@playwright/test';

export class CSAccountingContract {
  private contractName = 'CSAccounting';
  private contract: Contract;

  constructor() {
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
    return test.step(`Get bond summary from ${this.contractName} contract`, async () => {
      return this.contract.getBondSummary(nodeOperatorNumber);
    });
  }
}
