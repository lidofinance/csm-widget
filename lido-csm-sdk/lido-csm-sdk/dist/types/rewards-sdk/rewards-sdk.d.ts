import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { NodeOperatorId, RewardProof } from '../common/index.js';
import { SpendingSDK } from '../spending-sdk/spending-sdk.js';
export declare class RewardsSDK extends CsmSDKModule<{
  spending: SpendingSDK;
}> {
  private get contract();
  getProofTreeUrls(cid: string): string[];
  getProofTree(): Promise<
    | void
    | import('@openzeppelin/merkle-tree').StandardMerkleTree<
        import('./types.js').RewardsTreeLeaf
      >
  >;
  getProof(nodeOperatorId: NodeOperatorId): Promise<RewardProof>;
  getAvailable(
    nodeOperatorId: NodeOperatorId,
    { proof, shares }: RewardProof,
  ): Promise<bigint>;
  getRewards(nodeOperatorId: NodeOperatorId): Promise<{
    available: bigint;
    shares: bigint;
    proof: import('../common/tyles.js').Proof;
  }>;
  sharesToEth(amount: bigint): Promise<bigint>;
}
//# sourceMappingURL=rewards-sdk.d.ts.map
