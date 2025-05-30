import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { fetchTree } from './fetch-tree.js';
export const fetchRewardsTree = async (url, treeRoot) => {
    const treeJson = await fetchTree(url);
    const tree = StandardMerkleTree.load(treeJson);
    if (compareLowercase(tree.root, treeRoot))
        return tree;
    return null;
};
export const compareLowercase = (value1, value2) => value1 !== undefined && value1.toLowerCase() === value2?.toLowerCase();
export const fetchWithFallback = async (urls, fetcher) => {
    for (const url of urls) {
        if (!url)
            continue;
        try {
            const result = await fetcher(url);
            if (result)
                return result;
        }
        catch {
            /* noop */
        }
    }
};
//# sourceMappingURL=fetch-rewards-tree.js.map