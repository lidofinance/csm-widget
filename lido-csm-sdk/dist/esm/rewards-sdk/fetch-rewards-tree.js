import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { compareLowercase } from '../common/utils/compare-lowercase.js';
import { fetchJson } from '../common/utils/fetch-json.js';
const prepare = (text) => text.replace(/"value"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/gm, '"value":["$1","$2"]');
export const fetchRewardsTree = async (url, treeRoot) => {
    const treeJson = await fetchJson(url, undefined, (text) => JSON.parse(prepare(text)));
    const tree = StandardMerkleTree.load(treeJson);
    if (compareLowercase(tree.root, treeRoot))
        return tree;
    return null;
};
//# sourceMappingURL=fetch-rewards-tree.js.map