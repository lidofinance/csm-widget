import {
  encodeAbiParameters,
  keccak256,
  parseEther,
  toHex,
  zeroAddress,
  zeroHash,
} from 'viem';
import {
  BaseModuleAbi,
  FeeDistributorAbi,
  FeeOracleAbi,
  HashConsensusAbi,
} from '../abi';
import { makeRewardsReport } from '../rewards';
import type { ForkActionsService } from '../forkActions.service';

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
    name: 'getPooledEthByShares',
    stateMutability: 'view',
    inputs: [{ name: 'sharesAmount', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

const REPORT_DATA = FeeOracleAbi.find(
  (item) => item.type === 'function' && item.name === 'submitReportData',
)?.inputs[0];

const warp = async (
  service: ForkActionsService,
  timestamp: bigint,
): Promise<void> => {
  await service.client.request({
    method: 'evm_setNextBlockTimestamp' as never,
    params: [Number(timestamp)] as never,
  });
  await service.client.request({
    method: 'evm_mine' as never,
    params: [] as never,
  });
};

export const reportRewards = async function (
  this: ForkActionsService,
): Promise<void> {
  await this.step('[Contract] Report rewards', async () => {
    const report = await this.step('Build and pin rewards tree', () =>
      makeRewardsReport(this),
    );
    if (report.treeRoot === zeroHash) {
      console.warn('[Contract] No active keys, nothing to distribute');
      return;
    }

    const { distributed, rebate } = report;

    const feeDistributor = await this.client.readContract({
      address: this.addresses.module,
      abi: BaseModuleAbi,
      functionName: 'FEE_DISTRIBUTOR',
    });
    const [oracle, steth] = await Promise.all([
      this.client.readContract({
        address: feeDistributor,
        abi: FeeDistributorAbi,
        functionName: 'ORACLE',
      }),
      this.client.readContract({
        address: feeDistributor,
        abi: FeeDistributorAbi,
        functionName: 'STETH',
      }),
    ]);
    const consensus = await this.client.readContract({
      address: oracle,
      abi: FeeOracleAbi,
      functionName: 'getConsensusContract',
    });

    await this.step('Top up fee distributor', async () => {
      const pending = await this.client.readContract({
        address: feeDistributor,
        abi: FeeDistributorAbi,
        functionName: 'pendingSharesToDistribute',
      });
      if (pending >= distributed + rebate) return;

      const needed = await this.client.readContract({
        address: steth,
        abi: STETH_ABI,
        functionName: 'getPooledEthByShares',
        args: [distributed + rebate - pending],
      });
      const value = needed + parseEther('1');
      await this.fund(feeDistributor, value + parseEther('1'));
      await this.sendAs(feeDistributor, () =>
        this.client.writeContract({
          address: steth,
          abi: STETH_ABI,
          functionName: 'submit',
          args: [zeroAddress],
          account: feeDistributor,
          chain: null,
          value,
        }),
      );
    });

    const refSlot = await this.step('Warp to the next ref slot', async () => {
      const [slotsPerEpoch, secondsPerSlot, genesisTime] =
        await this.client.readContract({
          address: consensus,
          abi: HashConsensusAbi,
          functionName: 'getChainConfig',
        });
      const [initialEpoch, epochsPerFrame] = await this.client.readContract({
        address: consensus,
        abi: HashConsensusAbi,
        functionName: 'getFrameConfig',
      });

      const { timestamp } = await this.client.getBlock();
      const epoch = (timestamp - genesisTime) / secondsPerSlot / slotsPerEpoch;
      if (epoch < initialEpoch) {
        await warp(
          this,
          genesisTime + 1n + initialEpoch * slotsPerEpoch * secondsPerSlot,
        );
      }

      const [current] = await this.client.readContract({
        address: consensus,
        abi: HashConsensusAbi,
        functionName: 'getCurrentFrame',
      });
      const frameStart =
        genesisTime +
        (current + slotsPerEpoch * epochsPerFrame + 1n) * secondsPerSlot;
      const now = (await this.client.getBlock()).timestamp;
      if (frameStart > now) await warp(this, frameStart);

      const [next] = await this.client.readContract({
        address: consensus,
        abi: HashConsensusAbi,
        functionName: 'getCurrentFrame',
      });
      return next;
    });

    const consensusVersion = await this.client.readContract({
      address: oracle,
      abi: FeeOracleAbi,
      functionName: 'getConsensusVersion',
    });

    const data = {
      consensusVersion,
      refSlot,
      treeRoot: report.treeRoot,
      treeCid: report.treeCid,
      logCid: report.logCid,
      distributed,
      rebate,
      strikesTreeRoot: keccak256(toHex(`mock-strikes-${refSlot}`)),
      strikesTreeCid: `mock-strikes-${refSlot}`,
    } as const;

    if (!REPORT_DATA)
      throw new Error('ReportData input not found in FeeOracleAbi');
    const reportHash = keccak256(encodeAbiParameters([REPORT_DATA], [data]));

    const [members] = await this.client.readContract({
      address: consensus,
      abi: HashConsensusAbi,
      functionName: 'getFastLaneMembers',
    });

    await this.step(
      `Reach consensus with ${members.length} fast lane member(s)`,
      async () => {
        for (const member of members) {
          await this.fund(member, parseEther('1'));
          await this.sendAs(member, () =>
            this.client.writeContract({
              address: consensus,
              abi: HashConsensusAbi,
              functionName: 'submitReport',
              args: [refSlot, reportHash, consensusVersion],
              account: member,
              chain: null,
            }),
          );
        }
      },
    );

    const contractVersion = await this.client.readContract({
      address: oracle,
      abi: FeeOracleAbi,
      functionName: 'getContractVersion',
    });

    await this.step('Submit report data', async () => {
      const { request } = await this.client.simulateContract({
        address: oracle,
        abi: FeeOracleAbi,
        functionName: 'submitReportData',
        args: [data, contractVersion],
        account: members[0],
      });
      await this.sendAs(members[0], () =>
        this.client.writeContract({ ...request, chain: null }),
      );
    });
  });
};
