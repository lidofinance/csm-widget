import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export type DepositKey = {
  pubkey: string;
  withdrawal_credentials: string;
  amount: number;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
  network_name?: string;
  eth2_network_name?: string;
  deposit_cli_version: string;
};

interface DepositData {
  deposit_data: DepositKey[];
  keystores: any[];
  mnemonic: {
    seed: string;
  };
  private_keys: string[];
}

export class KeysGeneratorService {
  private depositData: DepositData | null = null;
  private readonly depositDataPath: string;
  private readonly binPath: string;

  constructor() {
    this.depositDataPath = path.join(process.cwd(), 'deposit_data.json');
    this.binPath = path.join(
      process.cwd(),
      'keys-generator-bin',
      'eth-staking-smith',
    );
  }

  /**
   * Generates keys for CSM using eth-staking-smith
   * @param numValidators - number of validators (default 1)
   * @param chain - network (default 'hoodi')
   * @param withdrawalCredentials - withdrawal credentials
   * @param password - keystore password (default 'testtest')
   * @returns KeysGeneratorService instance for chaining
   * @throws Error if key generation fails or validation fails
   */
  generateKeys(
    numValidators = 1,
    chain = 'hoodi',
    withdrawalCredentials = '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
    password = 'testtest',
  ): DepositKey[] {
    const command = `${this.binPath} new-mnemonic --chain ${chain} --keystore_password ${password} --num_validators ${numValidators} --withdrawal_credentials "${withdrawalCredentials}" > ${this.depositDataPath}`;

    try {
      execSync(command, {
        encoding: 'utf-8',
        cwd: process.cwd(),
      });

      // Verify that the deposit_data.json file was created
      if (!existsSync(this.depositDataPath)) {
        throw new Error(
          `Deposit data file was not created at ${this.depositDataPath}`,
        );
      }

      this.loadDepositData();
      return this.getDepositKeys();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate keys: ${error.message}`);
      }
      throw new Error(`Failed to generate keys: ${String(error)}`);
    }
  }

  loadDepositData(): void {
    try {
      const data = readFileSync(this.depositDataPath, 'utf-8');
      this.depositData = JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load deposit data: ${error}`);
    }
  }

  getDepositKeys(): DepositKey[] {
    if (!this.depositData) {
      this.loadDepositData();
    }
    return this.depositData?.deposit_data || [];
  }

  getMnemonic(): string {
    if (!this.depositData) {
      this.loadDepositData();
    }
    return this.depositData?.mnemonic.seed || '';
  }

  getPrivateKeys(): string[] {
    if (!this.depositData) {
      this.loadDepositData();
    }
    return this.depositData?.private_keys || [];
  }

  getKeystores(): any[] {
    if (!this.depositData) {
      this.loadDepositData();
    }
    return this.depositData?.keystores || [];
  }

  getAllData(): DepositData | null {
    if (!this.depositData) {
      this.loadDepositData();
    }
    return this.depositData;
  }
}
