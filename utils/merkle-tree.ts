import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { Proof } from 'types';

export interface StandardMerkleTreeData<T extends any[]> {
  format: 'standard-v1';
  tree: string[];
  values: {
    value: T;
    treeIndex: number;
  }[];
  leafEncoding: string[];
}

export const findIndexAndLeaf = <T extends any[]>(
  tree: StandardMerkleTree<T>,
  lookup: (leaf: T) => boolean,
) => {
  for (const [index, leaf] of tree.entries()) {
    if (lookup(leaf)) return [index, leaf] as const;
  }
  return [undefined];
};

export const findProofInTree = <T extends any[]>(
  tree: StandardMerkleTree<T>,
  lookup: (leaf: T) => boolean,
) => {
  const [index] = findIndexAndLeaf(tree, lookup);

  if (index !== undefined) {
    return tree.getProof(index) as Proof;
  }

  return undefined;
};
