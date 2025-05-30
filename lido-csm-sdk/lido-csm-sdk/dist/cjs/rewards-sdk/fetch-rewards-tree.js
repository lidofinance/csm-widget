"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithFallback = exports.compareLowercase = exports.fetchRewardsTree = void 0;
const merkle_tree_1 = require("@openzeppelin/merkle-tree");
const fetch_tree_js_1 = require("./fetch-tree.js");
const fetchRewardsTree = async (url, treeRoot) => {
    const treeJson = await (0, fetch_tree_js_1.fetchTree)(url);
    const tree = merkle_tree_1.StandardMerkleTree.load(treeJson);
    if ((0, exports.compareLowercase)(tree.root, treeRoot))
        return tree;
    return null;
};
exports.fetchRewardsTree = fetchRewardsTree;
const compareLowercase = (value1, value2) => value1 !== undefined && value1.toLowerCase() === value2?.toLowerCase();
exports.compareLowercase = compareLowercase;
const fetchWithFallback = async (urls, fetcher) => {
    for (const url of urls) {
        if (!url)
            continue;
        try {
            const result = await fetcher(url);
            if (result)
                return result;
        }
        catch {
        }
    }
};
exports.fetchWithFallback = fetchWithFallback;
//# sourceMappingURL=fetch-rewards-tree.js.map