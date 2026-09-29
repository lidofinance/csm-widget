import { parseEther } from 'viem';
import { COMMON_ADDRESSES, CONTRACT_NAMES } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import type { Hex } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

const STETH_ABI = [
  {
    type: 'function',
    name: 'submit',
    stateMutability: 'payable',
    inputs: [{ name: 'referral', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

const WSTETH_ABI = [
  {
    type: 'function',
    name: 'wrap',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_stETHAmount', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

const CHAIN_ID = { mainnet: CHAINS.Mainnet, hoodi: CHAINS.Hoodi } as const;

export const fundTokens = async function (
  this: ForkActionsService,
  address: Hex,
  amountEth: string,
): Promise<void> {
  await this.step(
    `[Contract] Fund ${address} with ${amountEth} stETH and wstETH`,
    async () => {
      const common = COMMON_ADDRESSES[CHAIN_ID[this.chain]];
      const steth = common[CONTRACT_NAMES.stETH];
      const wsteth = common[CONTRACT_NAMES.wstETH];
      if (!steth || !wsteth) {
        throw new Error(`No stETH/wstETH address on ${this.chain}`);
      }

      const value = parseEther(amountEth);
      await this.fund(address, value * 3n);

      await this.step(`Stake ${amountEth} ETH`, () =>
        this.sendAs(address, () =>
          this.client.writeContract({
            address: steth,
            abi: STETH_ABI,
            functionName: 'submit',
            args: ['0x0000000000000000000000000000000000000000'],
            account: address,
            chain: null,
            value,
          }),
        ),
      );

      await this.step(`Stake another ${amountEth} ETH to wrap`, () =>
        this.sendAs(address, () =>
          this.client.writeContract({
            address: steth,
            abi: STETH_ABI,
            functionName: 'submit',
            args: ['0x0000000000000000000000000000000000000000'],
            account: address,
            chain: null,
            value,
          }),
        ),
      );

      await this.step('Approve wstETH', () =>
        this.sendAs(address, () =>
          this.client.writeContract({
            address: steth,
            abi: STETH_ABI,
            functionName: 'approve',
            args: [wsteth, value],
            account: address,
            chain: null,
          }),
        ),
      );

      await this.step(`Wrap ${amountEth} stETH`, () =>
        this.sendAs(address, () =>
          this.client.writeContract({
            address: wsteth,
            abi: WSTETH_ABI,
            functionName: 'wrap',
            args: [value],
            account: address,
            chain: null,
          }),
        ),
      );
    },
  );
};
