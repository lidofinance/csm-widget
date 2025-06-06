import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { NodeOperatorId, RewardProof } from '../common/index.js';
import { EventsSDK } from '../events-sdk/events-sdk.js';
import { SpendingSDK } from '../spending-sdk/spending-sdk.js';
import { OperatorRewards } from './types.js';
export declare class RewardsSDK extends CsmSDKModule<{
    spending: SpendingSDK;
    events: EventsSDK;
}> {
    private get distributorContract();
    private get oracleContract();
    private get consensusContract();
    getProofTreeUrls(cid: string): string[];
    getLogUrls(cid: string): string[];
    getProofTree(): Promise<void | import("@openzeppelin/merkle-tree").StandardMerkleTree<import("./types.js").RewardsTreeLeaf>>;
    getProof(nodeOperatorId: NodeOperatorId): Promise<RewardProof>;
    getAvailable(nodeOperatorId: NodeOperatorId, { proof, shares }: RewardProof): Promise<bigint>;
    getRewards(nodeOperatorId: NodeOperatorId): Promise<{
        available: bigint;
        shares: bigint;
        proof: import("../common/tyles.js").Proof;
    }>;
    sharesToEth(amount: bigint): Promise<bigint>;
    getLastFrame(): Promise<{
        lastDistribution: number;
        nextDistribution: number;
        prevDistribution: number;
    }>;
    getLastReport(): Promise<void | import("./types.js").RewardsReportV1>;
    getOperatorRewardsInLastReport(nodeOperatorId: NodeOperatorId): Promise<OperatorRewards | undefined>;
    getLastReportTransactionHash(): Promise<`0x${string}` | undefined>;
}
//# sourceMappingURL=rewards-sdk.d.ts.map