import { test } from '@playwright/test';
import { BaseContractClient } from './baseClient.contract';

export class CSFeeOracleContract extends BaseContractClient {
  constructor() {
    super('CSFeeOracle');
  }

  async getLastProcessingRefSlot() {
    return test.step(`[${this.contractName}] Get last reward information`, async () => {
      return this.contract.getLastProcessingRefSlot();
    });
  }
}
