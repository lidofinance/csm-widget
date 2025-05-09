import { CSFeeOracleAbi, HashConsensusAbi } from 'abi';
import { config, secretConfig } from 'config';
import { CHAINS, CsmContract, getCsmContractAddress } from 'consts';
import {
  PublicClient,
  createPublicClient,
  fallback,
  getContract,
  http,
} from 'viem';
import * as chains from 'viem/chains';

const rpcUrls: Partial<Record<number, [string, ...string[]]>> = {
  [CHAINS.Mainnet]: secretConfig.rpcUrls_1,
  [CHAINS.Holesky]: secretConfig.rpcUrls_17000,
  [CHAINS.Hoodi]: secretConfig.rpcUrls_560048,
};

const getCsmContractAbi = (contractName: CsmContract) => {
  switch (contractName) {
    case 'HashConsensus':
      return HashConsensusAbi;
    case 'CSFeeOracle':
      return CSFeeOracleAbi;
    default:
      throw new Error(
        `Error: ABI is not configured for contract ${contractName}`,
      );
  }
};

let client: PublicClient | undefined = undefined;

export const getClient = () => {
  if (client) return client;
  const chainId = config.defaultChain;
  const chain = Object.values(chains).find((c) => c.id === chainId);
  const urls = rpcUrls[chainId as CHAINS];
  if (!urls) {
    throw new Error(`Error: RPC is not configured for chain ${chainId}`);
  }
  const batch = {
    wait: config.PROVIDER_BATCH_TIME,
    batchSize: config.PROVIDER_MAX_BATCH,
  };
  const publicClient = createPublicClient({
    chain,
    transport: fallback([
      ...urls.map((url) => http(url, { batch, name: url })),
      http(),
    ]),
  }) as PublicClient;
  client = publicClient;
  return client;
};

export const getCsmContract = (
  client: PublicClient,
  contractName: CsmContract,
) => {
  const chainId = client?.chain?.id as CHAINS;
  return getContract({
    client,
    address: getCsmContractAddress(chainId, contractName),
    abi: getCsmContractAbi(contractName),
  });
};
