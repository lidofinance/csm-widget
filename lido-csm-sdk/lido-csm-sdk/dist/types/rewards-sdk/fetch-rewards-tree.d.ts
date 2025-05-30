import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { RewardsTreeLeaf } from './types.js';
export declare const fetchRewardsTree: (
  url: string,
  treeRoot: string,
) => Promise<StandardMerkleTree<RewardsTreeLeaf> | null>;
export declare const compareLowercase: (
  value1?: string,
  value2?: string,
) => boolean;
export declare const fetchWithFallback: <T>(
  urls: Array<string | null>,
  fetcher: (url: string) => Promise<T | null>,
) => Promise<NonNullable<Awaited<T>> | void>;
//# sourceMappingURL=fetch-rewards-tree.d.ts.map
