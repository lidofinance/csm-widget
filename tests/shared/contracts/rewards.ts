import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { parseEther, zeroHash } from 'viem';
import { BaseModuleAbi, FeeDistributorAbi } from './abi/index.ts';
import type { Hex } from './constants.ts';
import type { ForkActionsService } from './forkActions.service.ts';
import { IPFS_GATEWAY_URL, pinJson } from './tree.ts';

const REWARD_PER_KEY = parseEther('0.1');
const PAD_NO_ID = (1n << 64n) - 1n;
const CHUNK = 20;
const LEAF_ENCODING = ['uint256', 'uint256'];

const stringify = (value: unknown) =>
  JSON.stringify(value, (_key, item: unknown) =>
    typeof item === 'bigint' ? `${item}n` : item,
  ).replaceAll(/"(\d+)n"/g, '$1');

export type RewardsReport = {
  treeRoot: Hex;
  treeCid: string;
  logCid: string;
  distributed: bigint;
  rebate: bigint;
};

const activeKeysByOperator = async (service: ForkActionsService) => {
  const count = await service.client.readContract({
    address: service.addresses.module,
    abi: BaseModuleAbi,
    functionName: 'getNodeOperatorsCount',
  });

  const active = new Map<bigint, number>();
  for (let from = 0n; from < count; from += BigInt(CHUNK)) {
    const ids = Array.from(
      { length: Number(count - from < BigInt(CHUNK) ? count - from : CHUNK) },
      (_unused, index) => from + BigInt(index),
    );
    const operators = await Promise.all(
      ids.map((id) =>
        service.client.readContract({
          address: service.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'getNodeOperator',
          args: [id],
        }),
      ),
    );
    operators.forEach((operator, index) => {
      const keys = operator.totalDepositedKeys - operator.totalWithdrawnKeys;
      if (keys > 0) active.set(ids[index], keys);
    });
  }
  return active;
};

const previousCumulatives = async (service: ForkActionsService) => {
  const feeDistributor = await service.client.readContract({
    address: service.addresses.module,
    abi: BaseModuleAbi,
    functionName: 'FEE_DISTRIBUTOR',
  });
  const root = await service.client.readContract({
    address: feeDistributor,
    abi: FeeDistributorAbi,
    functionName: 'treeRoot',
  });

  const cumulatives = new Map<bigint, bigint>();
  if (root === zeroHash) return cumulatives;

  const cid = await service.client.readContract({
    address: feeDistributor,
    abi: FeeDistributorAbi,
    functionName: 'treeCid',
  });
  const res = await fetch(`${IPFS_GATEWAY_URL}/ipfs/${cid}`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    throw new Error(
      `Cannot fetch the current rewards tree ${cid}: ${res.status}`,
    );
  }

  // Shares exceed Number.MAX_SAFE_INTEGER, so the dump is read as text.
  const dump = await res.text();
  const leafPattern = /"value"\s*:\s*\[\s*"?(\d+)"?\s*,\s*"?(\d+)"?\s*\]/g;
  for (const [, noId, shares] of dump.matchAll(leafPattern)) {
    cumulatives.set(BigInt(noId), BigInt(shares));
  }
  if (cumulatives.size === 0) {
    throw new Error(`Rewards tree ${cid} has no leaves`);
  }

  const restored = StandardMerkleTree.of(
    [...cumulatives.entries()].map(([noId, shares]) => [noId, shares]),
    LEAF_ENCODING,
  );
  if (restored.root.toLowerCase() !== root.toLowerCase()) {
    throw new Error(`Rewards tree ${cid} does not match the on-chain root`);
  }
  return cumulatives;
};

export const makeRewardsReport = async (
  service: ForkActionsService,
): Promise<RewardsReport> => {
  const [active, cumulatives] = await Promise.all([
    activeKeysByOperator(service),
    previousCumulatives(service),
  ]);

  cumulatives.delete(PAD_NO_ID);

  let distributed = 0n;
  for (const [noId, keys] of active) {
    const reward = REWARD_PER_KEY * BigInt(keys);
    cumulatives.set(noId, (cumulatives.get(noId) ?? 0n) + reward);
    distributed += reward;
  }

  const leaves = [...cumulatives.entries()].map(([noId, shares]) => [
    noId,
    shares,
  ]);
  if (leaves.length === 1) leaves.push([PAD_NO_ID, 0n]);
  if (leaves.length === 0) {
    return {
      treeRoot: zeroHash,
      treeCid: '',
      logCid: '',
      distributed: 0n,
      rebate: 0n,
    };
  }

  const tree = StandardMerkleTree.of(leaves, LEAF_ENCODING);
  const block = await service.client.getBlock();
  const log = {
    blockstamp: {
      block_hash: block.hash,
      block_number: block.number,
      block_timestamp: block.timestamp,
    },
    operators: Object.fromEntries(
      [...active].map(([noId, keys]) => [
        String(noId),
        { distributed_rewards: REWARD_PER_KEY * BigInt(keys), keys },
      ]),
    ),
  };

  const [treeCid, logCid] = await Promise.all([
    pinJson('merkle-tree.json', stringify(tree.dump())),
    pinJson('report.json', stringify(log)),
  ]);

  return {
    treeRoot: tree.root as Hex,
    treeCid,
    logCid,
    distributed,
    rebate: 0n,
  };
};
