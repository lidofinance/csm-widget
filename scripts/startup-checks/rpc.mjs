import { createClient, http } from 'viem';
import { getChainId } from 'viem/actions';

export const BROKEN_URL = 'BROKEN_URL';
export const RPC_TIMEOUT_MS = 10_000;
export const MAX_RETRY_COUNT = 3;

const parseUrlList = (val) =>
  val
    ?.split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean) ?? [];

const getRPCUrls = (chainId) => {
  return parseUrlList(process.env[`EL_RPC_URLS_${chainId}`]);
};

const checkRPC = async (url, chainId) => {
  let domain;
  try {
    domain = new URL(url).hostname;
  } catch {
    console.error(`[checkRPC] Invalid URL: ${url}`);
    return { domain: BROKEN_URL, chainId, success: false };
  }

  try {
    const client = createClient({
      transport: http(url, {
        retryCount: MAX_RETRY_COUNT,
        timeout: RPC_TIMEOUT_MS,
      }),
    });

    const chainIdClient = await getChainId(client);

    if (chainIdClient === chainId) {
      console.info(`[checkRPC] [chainId=${chainId}] RPC ${domain} is working`);
      return { domain, chainId, success: true };
    } else {
      throw new Error(`Expected chainId ${chainId}, but got ${chainIdClient}`);
    }
  } catch (err) {
    console.error(
      `[checkRPC] [chainId=${chainId}] Error checking RPC ${domain}: ${err.message}`,
    );
    return { domain, chainId, success: false };
  }
};

export const startupCheckRPCs = () => {
  console.info('[startupCheckRPCs] Starting RPC checks...');

  // Bad config crashloops new pods (halting the rollout); unreachable RPCs only log,
  // since upstream state is shared across replicas
  const defaultChain = parseInt(process.env.DEFAULT_CHAIN, 10);
  if (!defaultChain) {
    throw new Error('[startupCheckRPCs] DEFAULT_CHAIN is not configured!');
  }
  const rpcUrls = getRPCUrls(defaultChain);
  if (rpcUrls.length === 0) {
    throw new Error(
      `[startupCheckRPCs] [chainId=${defaultChain}] No RPC URLs found!`,
    );
  }

  return Promise.all(rpcUrls.map((url) => checkRPC(url, defaultChain))).then(
    (chainCheckResults) => {
      const brokenRPCCount = chainCheckResults.filter(
        (result) => !result.success,
      ).length;
      console.info(
        `[startupCheckRPCs] [chainId=${defaultChain}] Working/Total RPCs: ${chainCheckResults.length - brokenRPCCount}/${chainCheckResults.length}`,
      );
      return chainCheckResults;
    },
  );
};
