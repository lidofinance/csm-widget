"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRewardsTree = void 0;
const merkle_tree_1 = require("@openzeppelin/merkle-tree");
const compare_lowercase_js_1 = require("../common/utils/compare-lowercase.js");
const fetch_json_js_1 = require("../common/utils/fetch-json.js");
const prepare = (text) => text.replace(/"value"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/gm, '"value":["$1","$2"]');
const fetchRewardsTree = async (url, treeRoot) => {
    const treeJson = await (0, fetch_json_js_1.fetchJson)(url, undefined, (text) => JSON.parse(prepare(text)));
    const tree = merkle_tree_1.StandardMerkleTree.load(treeJson);
    if ((0, compare_lowercase_js_1.compareLowercase)(tree.root, treeRoot))
        return tree;
    return null;
};
exports.fetchRewardsTree = fetchRewardsTree;
//# sourceMappingURL=fetch-rewards-tree.js.map