import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { NodeOperatorId, RewardProof } from '../common/tyles.js';
import { RewardsTreeLeaf } from './types.js';
export declare const EMPTY_PROOF: RewardProof;
export declare const findIndexAndLeaf: <T extends any[]>(tree: StandardMerkleTree<T>, lookup: (leaf: T) => boolean) => undefined[] | readonly [number, T];
export declare const findProofAndAmount: (tree: StandardMerkleTree<RewardsTreeLeaf>, nodeOperatorId: NodeOperatorId) => RewardProof;
//# sourceMappingURL=find-proof.d.ts.map