import { test } from '@playwright/test';
import { BaseContractClient } from './baseClient.contract';

export class CSAccountingContract extends BaseContractClient {
  constructor() {
    super('CSAccounting');
  }

  async getBondSummary(nodeOperatorNumber: number) {
    return test.step(`Get bond summary from ${this.contractName} contract`, async () => {
      return this.contract.getBondSummary(nodeOperatorNumber);
    });
  }
}
