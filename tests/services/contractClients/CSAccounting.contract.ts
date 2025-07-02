import { test } from '@playwright/test';
import { BaseContractClient } from './baseClient.contract';
import { formatEther } from '@ethersproject/units';

export class CSAccountingContract extends BaseContractClient {
  constructor() {
    super('CSAccounting');
  }

  async getBondSummary(nodeOperatorNumber: number) {
    return test.step(`Get bond summary from ${this.contractName} contract`, async () => {
      const bondSummary =
        await this.contract.getBondSummary(nodeOperatorNumber);

      const excessBond = formatEther(
        BigInt(bondSummary.current - bondSummary.required),
      );

      return {
        required: formatEther(bondSummary.required),
        current: formatEther(bondSummary.current),
        excess: excessBond,
      };
    });
  }
}
