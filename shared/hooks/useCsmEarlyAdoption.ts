import { useContractSWR, useLidoSWR } from '@lido-sdk/react';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { getCSMEarlyAdoptionTreeUrl } from 'consts/csm-early-adoption';
import { STRATEGY_CONSTANT, STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { standardFetcher } from 'utils';
import { StandardMerkleTreeData, findProofInTree } from 'utils/merkle-tree';
import { Address } from 'wagmi';
import { useAccount } from './use-account';
import { useAddressCompare } from './use-address-compare';
import { useCSEarlyAdoptionRPC } from './useCsmContracts';

type EATreeLeaf = [Address];

export const useCsmEarlyAdoptionTree = (config = STRATEGY_IMMUTABLE) => {
  const { chainId } = useAccount();
  const url = getCSMEarlyAdoptionTreeUrl(chainId);
  const contract = useCSEarlyAdoptionRPC();

  return useLidoSWR(
    ['csm-ea', url],
    async () => {
      if (!url) return undefined;

      // TODO: check speed if load addresses.json and build tree + check root

      const treeJson = await standardFetcher<
        StandardMerkleTreeData<EATreeLeaf>
      >(url, { headers: {} });
      const tree = StandardMerkleTree.load(treeJson);

      const treeRoot = await contract.TREE_ROOT();

      if (treeRoot !== tree.root) {
        throw new Error('Mismatch EA treeRoot');
      }

      return tree;
    },
    config,
  );
};

export const useCsmEarlyAdoptionProof = () => {
  const isUserAddress = useAddressCompare();
  const { data: tree, ...swr } = useCsmEarlyAdoptionTree();

  // TODO: async search
  const proofData = useMemo(() => {
    // TODO: check speed if get proof by leaf `[address.toLowerCase()]`
    return tree
      ? findProofInTree(tree, (leaf) => isUserAddress(leaf[0]))
      : undefined;
  }, [isUserAddress, tree]);

  return { ...swr, data: proofData };
};

export const useCsmEarlyAdoptionProofConsumed = (
  config = STRATEGY_CONSTANT,
) => {
  const { address } = useAccount();

  return useContractSWR({
    contract: useCSEarlyAdoptionRPC(),
    method: 'isConsumed',
    params: [address],
    shouldFetch: !!address,
    config,
  });
};

export const useCsmEarlyAdoption = () => {
  const swrProof = useCsmEarlyAdoptionProof();
  const swrConsumed = useCsmEarlyAdoptionProofConsumed();

  return {
    data: {
      proof: swrConsumed.data ? undefined : swrProof.data,
      consumed: swrConsumed.data,
    },
    loading: swrProof.loading || swrConsumed.loading,
    initialLoading: swrProof.initialLoading || swrConsumed.initialLoading,
    error: swrProof.error || swrConsumed.error,
  };
};
