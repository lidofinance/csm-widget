import { test } from '@playwright/test';
import {
  createWalletClient,
  formatEther,
  http,
  publicActions,
  toHex,
  type Address,
} from 'viem';
import { BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import {
  addBond,
  addKeys,
  confirmManager,
  createCuratedOperator,
  createOperatorGroup,
  depositKeys,
  proposeManager,
  proposeReward,
  reportPenalty,
  reportRewards,
  revert,
  setGateAddrs,
  setShareLimit,
  settlePenalty,
  snapshot,
} from './commands/index.ts';
import {
  addresses as addressesFor,
  type Addresses,
  type ChainName,
  type Hex,
  type ModuleName,
} from './constants.ts';

const commands = {
  addBond,
  addKeys,
  confirmManager,
  createCuratedOperator,
  createOperatorGroup,
  depositKeys,
  proposeManager,
  proposeReward,
  reportPenalty,
  reportRewards,
  revert,
  setGateAddrs,
  setShareLimit,
  settlePenalty,
  snapshot,
};

type Commands = typeof commands;

export const COMMANDS = Object.keys(commands) as (keyof Commands)[];

export type StepFn = <T>(title: string, body: () => Promise<T>) => Promise<T>;

export type ForkActionsOptions = {
  rpcUrl: string;
  chain: ChainName;
  module: ModuleName;
  step?: StepFn;
};

const RPC_TIMEOUT_MS = 300_000;

const createForkClient = (rpcUrl: string) =>
  createWalletClient({
    transport: http(rpcUrl, { timeout: RPC_TIMEOUT_MS }),
  }).extend(publicActions);

export interface ForkActionsService extends Commands {}

export class ForkActionsService {
  readonly client: ReturnType<typeof createForkClient>;
  readonly addresses: Addresses;
  readonly chain: ChainName;
  readonly module: ModuleName;
  readonly step: StepFn;

  constructor({ rpcUrl, chain, module, step }: ForkActionsOptions) {
    const addresses = addressesFor(chain, module);
    if (!addresses) {
      throw new Error(`No addresses for module "${module}" on ${chain}`);
    }

    this.addresses = addresses;
    this.chain = chain;
    this.module = module;
    this.step = step ?? test.step;
    this.client = createForkClient(rpcUrl);

    for (const [name, command] of Object.entries(commands)) {
      Object.assign(this, { [name]: command.bind(this) });
    }
  }

  async manager(noId: number): Promise<Hex> {
    return this.step(`Resolve manager of NO #${noId}`, async () => {
      const { managerAddress } = await this.client.readContract({
        address: this.addresses.module,
        abi: BaseModuleAbi,
        functionName: 'getNodeOperatorManagementProperties',
        args: [BigInt(noId)],
      });
      return managerAddress;
    });
  }

  async roleMember(
    role:
      | 'REPORT_GENERAL_DELAYED_PENALTY_ROLE'
      | 'SETTLE_GENERAL_DELAYED_PENALTY_ROLE'
      | 'DEFAULT_ADMIN_ROLE',
    index = 0n,
  ): Promise<Hex> {
    return this.step(`Resolve ${role} holder`, async () => {
      const hash = await this.client.readContract({
        address: this.addresses.module,
        abi: BaseModuleAbi,
        functionName: role,
      });
      return this.client.readContract({
        address: this.addresses.module,
        abi: BaseModuleAbi,
        functionName: 'getRoleMember',
        args: [hash, index],
      });
    });
  }

  async fund(address: Address, value: bigint) {
    await this.step(
      `Fund ${address} with ${formatEther(value)} ETH`,
      async () => {
        const balance = await this.client.getBalance({ address });
        await this.client.request({
          method: 'anvil_setBalance' as never,
          params: [address, toHex(balance + value)] as never,
        });
      },
    );
  }

  async sendAs(from: Address, send: () => Promise<Hex>) {
    await this.step(`Send transaction as ${from}`, async () => {
      await this.client.request({
        method: 'anvil_impersonateAccount' as never,
        params: [from] as never,
      });
      try {
        const hash = await send();
        const { status, gasUsed } = await this.step(`Wait for ${hash}`, () =>
          this.client.waitForTransactionReceipt({
            hash,
            timeout: RPC_TIMEOUT_MS,
          }),
        );
        if (status !== 'success') {
          throw new Error(`Transaction ${hash} reverted (gas used ${gasUsed})`);
        }
      } finally {
        await this.client.request({
          method: 'anvil_stopImpersonatingAccount' as never,
          params: [from] as never,
        });
      }
    });
  }
}
