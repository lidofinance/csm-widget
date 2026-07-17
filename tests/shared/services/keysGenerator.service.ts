import {
  makeDepositKeys,
  type ChainName,
  type DepositKey,
  type MakeDepositKeysResult,
} from '@sm-lab/keys';

export type { DepositKey };

/**
 * BLS deposit-data generator over @sm-lab/keys (pure TS, in-process).
 * Replaces the eth-staking-smith binary. Keys pass the SDK's on-upload BLS validation.
 */
export class KeysGeneratorService {
  private lastResult: MakeDepositKeysResult | null = null;

  constructor(private options?: { isCM?: boolean }) {}

  /**
   * Generates deposit keys.
   * @param numValidators - number of validators (default 1)
   * @param chain - network (default 'hoodi')
   * @param withdrawalCredentials - withdrawal address (defaults to the Lido withdrawal vault)
   * @param mnemonic - BIP-39 phrase for reproducible keys (random when omitted)
   */
  async generateKeys(
    numValidators = 1,
    chain: ChainName = 'hoodi',
    withdrawalCredentials = '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2' as const,
    mnemonic?: string,
  ): Promise<DepositKey[]> {
    this.lastResult = await makeDepositKeys({
      chain,
      count: numValidators,
      type: this.options?.isCM ? '0x02' : '0x01',
      withdrawalAddress: withdrawalCredentials,
      mnemonic,
    });
    return this.lastResult.keys;
  }

  getDepositKeys(): DepositKey[] {
    return this.lastResult?.keys ?? [];
  }

  getMnemonic(): string {
    return this.lastResult?.mnemonic ?? '';
  }
}
