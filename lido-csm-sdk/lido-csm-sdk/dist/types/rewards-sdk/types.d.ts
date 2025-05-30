export type RewardsTreeLeaf = [string, string];
export interface StandardMerkleTreeData<T extends any[]> {
  format: 'standard-v1';
  tree: string[];
  values: {
    value: T;
    treeIndex: number;
  }[];
  leafEncoding: string[];
}
//# sourceMappingURL=types.d.ts.map
