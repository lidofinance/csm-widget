import { Hash, Hex } from 'viem';
export type RewardsTreeLeaf = [string, string];
export type StandardMerkleTreeData<T extends any[]> = {
    format: 'standard-v1';
    tree: string[];
    values: {
        value: T;
        treeIndex: number;
    }[];
    leafEncoding: string[];
};
export type RewardsTree = StandardMerkleTreeData<RewardsTreeLeaf>;
export type RewardsReportV1 = {
    blockstamp: {
        block_hash: Hash;
        block_number: number;
        block_timestamp: number;
        ref_epoch: number;
        ref_slot: number;
        slot_number: number;
        state_root: Hex;
    };
    distributable: number;
    frame: [number, number];
    threshold: number;
    operators: Record<`${number}`, {
        distributed: number;
        validators: Record<`${number}`, {
            perf: {
                assigned: number;
                included: number;
            };
            slashed: boolean;
        }>;
    }>;
};
export type RewardsReportV2 = {
    blockstamp: {
        block_hash: Hash;
        block_number: number;
        block_timestamp: number;
        ref_epoch: number;
        ref_slot: number;
        slot_number: number;
        state_root: Hex;
    };
    distributable: number;
    distributed_rewards: number;
    rebate_to_protocol: number;
    frame: [number, number];
    operators: Record<`${number}`, {
        distributed_rewards: number;
        performance_coefficients: {
            attestations_weight: number;
            blocks_weight: number;
            sync_weight: number;
        };
        validators: Record<`${number}`, {
            attestation_duty: {
                assigned: number;
                included: number;
            };
            distributed_rewards: number;
            performance: number;
            proposal_duty: {
                assigned: number;
                included: number;
            };
            rewards_share: number;
            slashed: boolean;
            strikes: number;
            sync_duty: {
                assigned: number;
                included: number;
            };
            threshold: number;
        }>;
    }>;
};
export type RewardsReport = RewardsReportV1;
export type OperatorRewards = {
    distributed: bigint;
    validatorsCount: number;
    validatorsOverThresholdCount: number;
    threshold: number;
};
//# sourceMappingURL=types.d.ts.map