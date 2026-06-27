import { wagmiChainMap } from 'modules/web3/web3-provider/web3-provider';
import { Address } from 'viem';
import { Config, createConfig, http } from 'wagmi';
import { mock } from 'wagmi/connectors';

// A self-contained wagmi config with a mock connector pre-set to `account`.
// The connector auto-connects on mount (see MockClaimBondProvider) so that
// useDappStatus() reports a connected address on the stand's default chain —
// enough to satisfy the claimBond CLAIMER access gate without a real wallet.
export const createMockWagmiConfig = (
  chainId: number,
  account: Address,
): Config => {
  const chain = wagmiChainMap[chainId];
  return createConfig({
    chains: [chain],
    connectors: [mock({ accounts: [account] })],
    transports: { [chain.id]: http() },
    ssr: false,
  });
};
