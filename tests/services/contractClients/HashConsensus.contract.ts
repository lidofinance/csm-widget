import { test } from '@playwright/test';
import { BaseContractClient } from './baseClient.contract';

export class HashConsensusContract extends BaseContractClient {
  constructor() {
    super('HashConsensus');
  }

  async getFrameConfig() {
    return test.step(`[${this.contractName}] Get frame config`, async () => {
      return this.contract.getFrameConfig();
    });
  }

  async getChainConfig() {
    return test.step(`[${this.contractName}] Get chain config`, async () => {
      return this.contract.getChainConfig();
    });
  }
}
