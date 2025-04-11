import { CHAINS } from '@lido-sdk/constants';
import { iterateUrls } from '@lidofinance/rpc';
import { config, secretConfig } from 'config';
import { getCsmContractAddress } from 'consts/csm-constants';
import { BigNumber } from 'ethers';
import { HashConsensus__factory } from 'generated';
import { Cache } from 'memory-cache';
import { CurrentFrame } from 'types/ethseer';
import { getStaticRpcBatchProvider } from 'utils/getStaticRpcBatchProvider';

const cache = new Cache<string, CurrentFrame>();

const rpcUrls: Partial<Record<CHAINS, [string, ...string[]]>> = {
  [CHAINS.Mainnet]: secretConfig.rpcUrls_1,
  [CHAINS.Holesky]: secretConfig.rpcUrls_17000,
  [CHAINS.Hoodi]: secretConfig.rpcUrls_560048,
};

export const getCurrentFrame = async () => {
  const chainId = config.defaultChain;
  const cacheKey = `${config.CACHE_ETHSEER_RATE_KEY}_frame`;
  const data = cache.get(cacheKey);
  if (data) {
    return data;
  }

  const urls = rpcUrls[chainId as CHAINS];
  if (!urls) {
    throw new Error(`Error: RPC is not configured for chain ${chainId}`);
  }
  const currentFrame = await iterateUrls(urls, (url) =>
    _getCurentFrame(url, chainId),
  );

  cache.put(cacheKey, currentFrame, config.CACHE_ETHSEER_RATE_TTL);
  return currentFrame;
};

export const _getCurentFrame = async (
  url: string,
  chainId: CHAINS,
): Promise<CurrentFrame> => {
  const staticProvider = getStaticRpcBatchProvider(chainId, url);

  const { timestamp: latestBlockTimestamp } =
    await staticProvider.getBlock('latest');

  const hashConsensus = HashConsensus__factory.connect(
    getCsmContractAddress(chainId, 'HashConsensus'),
    staticProvider,
  );

  const chainConfig = await hashConsensus.getChainConfig();
  const frameConfig = await hashConsensus.getFrameConfig();
  const currentFrame = await hashConsensus.getCurrentFrame();

  const latestSlot = BigNumber.from(latestBlockTimestamp)
    .sub(chainConfig.genesisTime)
    .div(chainConfig.secondsPerSlot);

  const slotsPerFrame = frameConfig.epochsPerFrame.mul(
    chainConfig.slotsPerEpoch,
  );

  const startSlot = latestSlot
    .sub(currentFrame.refSlot)
    .div(slotsPerFrame)
    .mul(slotsPerFrame)
    .add(currentFrame.refSlot);
  const startTimestamp = startSlot
    .mul(chainConfig.secondsPerSlot)
    .add(chainConfig.genesisTime)
    .toNumber();

  const numberEpochs = latestSlot
    .sub(startSlot)
    .div(chainConfig.slotsPerEpoch)
    .toNumber();

  return {
    endTimestamp: latestBlockTimestamp,
    startTimestamp,
    numberEpochs,
  };
};
