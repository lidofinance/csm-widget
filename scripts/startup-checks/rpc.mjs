import { createClient, http } from 'viem';
import { getChainId } from 'viem/actions';

export const BROKEN_URL = 'BROKEN_URL';
export const RPC_TIMEOUT_MS = 10_000;
export const MAX_RETRY_COUNT = 3;

// Safely initialize a global variable
const globalStartupRPCChecks = globalThis.__startupRPCChecks || {
  promise: null,
  resolved: false,
  result: null,
  reason: null,
};
globalThis.__startupRPCChecks = globalStartupRPCChecks;

const getRPCUrls = (chainId) => {
  const rpcUrls = process.env[`EL_RPC_URLS_${chainId}`]?.split(',');
  return rpcUrls?.filter((url) => url);
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

export const getRPCChecks = () => globalStartupRPCChecks.promise;

export const getRPCCheckState = () => ({
  started: !!globalStartupRPCChecks.promise,
  resolved: globalStartupRPCChecks.resolved,
  result: globalStartupRPCChecks.result,
  reason: globalStartupRPCChecks.reason,
});

export const startupCheckRPCs = async () => {
  console.info('[startupCheckRPCs] Starting RPC checks...');

  if (globalStartupRPCChecks.promise) {
    return globalStartupRPCChecks.promise;
  }

  globalStartupRPCChecks.promise = (async () => {
    try {
      const defaultChain = parseInt(process.env.DEFAULT_CHAIN, 10);
      if (!defaultChain) {
        throw new Error('[startupCheckRPCs] DEFAULT_CHAIN is not configured!');
      }

      const results = [];

      const rpcUrls = getRPCUrls(defaultChain);
      if (!rpcUrls?.length) {
        throw new Error(
          `[startupCheckRPCs] [chainId=${defaultChain}] No RPC URLs found!`,
        );
      }

      const chainCheckResults = await Promise.all(
        rpcUrls.map((url) => checkRPC(url, defaultChain)),
      );
      results.push(...chainCheckResults);

      const brokenRPCCount = chainCheckResults.filter(
        (result) => !result.success,
      ).length;
      console.info(
        `[startupCheckRPCs] [chainId=${defaultChain}] Working/Total RPCs: ${chainCheckResults.length - brokenRPCCount}/${chainCheckResults.length}`,
      );

      globalStartupRPCChecks.result = results;
      return results;
    } catch (err) {
      console.error('[startupCheckRPCs] Error during RPC checks:', err);
      globalStartupRPCChecks.reason = err?.message ?? String(err);
      globalStartupRPCChecks.result = null;
      return null;
    } finally {
      globalStartupRPCChecks.resolved = true;
    }
  })();
};
