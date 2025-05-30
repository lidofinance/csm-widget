export const EMPTY_PROOF = { proof: [], shares: 0n };
export const findIndexAndLeaf = (tree, lookup) => {
    for (const [index, leaf] of tree.entries()) {
        if (lookup(leaf))
            return [index, leaf];
    }
    return [undefined];
};
export const findProofAndAmount = (tree, nodeOperatorId) => {
    const id = nodeOperatorId.toString();
    const [index, leaf] = findIndexAndLeaf(tree, (leaf) => leaf[0] === id);
    if (index !== undefined && leaf) {
        return {
            proof: tree.getProof(index),
            shares: BigInt(leaf[1]),
        };
    }
    return EMPTY_PROOF;
};
//# sourceMappingURL=find-proof.js.map