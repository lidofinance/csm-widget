"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProofAndAmount = exports.findIndexAndLeaf = exports.EMPTY_PROOF = void 0;
exports.EMPTY_PROOF = { proof: [], shares: 0n };
const findIndexAndLeaf = (tree, lookup) => {
    for (const [index, leaf] of tree.entries()) {
        if (lookup(leaf))
            return [index, leaf];
    }
    return [undefined];
};
exports.findIndexAndLeaf = findIndexAndLeaf;
const findProofAndAmount = (tree, nodeOperatorId) => {
    const id = nodeOperatorId.toString();
    const [index, leaf] = (0, exports.findIndexAndLeaf)(tree, (leaf) => leaf[0] === id);
    if (index !== undefined && leaf) {
        return {
            proof: tree.getProof(index),
            shares: BigInt(leaf[1]),
        };
    }
    return exports.EMPTY_PROOF;
};
exports.findProofAndAmount = findProofAndAmount;
//# sourceMappingURL=find-proof.js.map