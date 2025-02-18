import { CHAINS } from '@lido-sdk/constants';
import getConfig from 'next/config';

interface DappnodeUrls {
  brainUrl: string;
  brainKeysUrl: string;
  brainLaunchpadUrl: string;
  signerUrl: string;
  sentinelUrl: string;
  stakersUiUrl: string;
  backendUrl: string;
  ECApiUrl: string;
  CCVersionApiUrl: string;
  CCStatusApiUrl: string;
  keysStatusUrl: string;
  installerTabUrl: string;
  MEVApiUrl: string;
  MEVPackageConfig: string;
}

const useDappnodeUrls = () => {
  // Rely on runtime config to get the chainId and avoid nullish values when wallet is not connected from chainId
  const { publicRuntimeConfig } = getConfig();

  const urlsByChain: Partial<Record<CHAINS, DappnodeUrls>> = {
    [CHAINS.Mainnet]: {
      brainUrl: 'http://brain.web3signer.dappnode',
      brainKeysUrl: '/api/brain-keys-mainnet',
      brainLaunchpadUrl: '/api/brain-launchpad-mainnet',
      signerUrl: 'http://web3signer.web3signer.dappnode',
      sentinelUrl: 'https://t.me/CSMSentinel_bot',
      stakersUiUrl: 'http://my.dappnode/stakers/ethereum',
      backendUrl: 'http://lido-events.lido-csm-mainnet.dappnode:8080',
      ECApiUrl:
        publicRuntimeConfig.rpcUrls_1 ||
        'http://execution.mainnet.dncore.dappnode:8545',
      CCVersionApiUrl: '/api/consensus-version-mainnet',
      CCStatusApiUrl: '/api/consensus-status-mainnet',
      keysStatusUrl: '/api/keys-status-mainnet',
      installerTabUrl:
        'http://my.dappnode/installer/dnp/lido-csm-holesky.dnp.dappnode.eth',
      MEVApiUrl: '/api/mev-status-mainnet',
      MEVPackageConfig:
        'http://my.dappnode/packages/my/mev-boost.dnp.dappnode.eth/config',
    },
    [CHAINS.Holesky]: {
      brainUrl: 'http://brain.web3signer-holesky.dappnode',
      brainKeysUrl: '/api/brain-keys-holesky',
      brainLaunchpadUrl: '/api/brain-launchpad-holesky',
      signerUrl: 'http://web3signer.web3signer-holesky.dappnode',
      sentinelUrl: 'https://t.me/CSMSentinelHolesky_bot',
      stakersUiUrl: 'http://my.dappnode/stakers/holesky',
      backendUrl: 'http://lido-events.lido-csm-holesky.dappnode:8080',
      ECApiUrl:
        publicRuntimeConfig.rpcUrls_17000 ||
        'http://execution.holesky.dncore.dappnode:8545',
      CCVersionApiUrl: '/api/consensus-version-holesky',
      CCStatusApiUrl: '/api/consensus-status-holesky',
      keysStatusUrl: '/api/keys-status-holesky',
      installerTabUrl:
        'http://my.dappnode/installer/dnp/lido-csm-mainnet.dnp.dappnode.eth',
      MEVApiUrl: '/api/mev-status-holesky',
      MEVPackageConfig:
        'http://my.dappnode/packages/my/mev-boost-holesky.dnp.dappnode.eth/config',
    },
  };

  const brainUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.brainUrl || '';
  const brainKeysUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.brainKeysUrl || '';
  const brainLaunchpadUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]
      ?.brainLaunchpadUrl || '';
  const signerUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.signerUrl || '';
  const sentinelUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.sentinelUrl || '';
  const stakersUiUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.stakersUiUrl || '';
  const backendUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.backendUrl || '';
  const ECApiUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.ECApiUrl || '';
  const CCVersionApiUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.CCVersionApiUrl ||
    '';
  const CCStatusApiUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.CCStatusApiUrl ||
    '';
  const keysStatusUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.keysStatusUrl ||
    '';
  const installerTabUrl = (isMainnet: boolean) =>
    urlsByChain[isMainnet ? 1 : 17000]?.installerTabUrl;
  const MEVApiUrl =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.MEVApiUrl || '';
  const MEVPackageConfig =
    urlsByChain[publicRuntimeConfig.defaultChain as CHAINS]?.MEVPackageConfig ||
    '';

  return {
    brainUrl,
    brainKeysUrl,
    brainLaunchpadUrl,
    signerUrl,
    sentinelUrl,
    stakersUiUrl,
    backendUrl,
    ECApiUrl,
    CCVersionApiUrl,
    CCStatusApiUrl,
    keysStatusUrl,
    installerTabUrl,
    MEVApiUrl,
    MEVPackageConfig,
  };
};

export default useDappnodeUrls;
