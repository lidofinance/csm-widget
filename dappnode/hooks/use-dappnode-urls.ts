import { CHAINS } from '@lido-sdk/constants';
import { useAccount } from 'shared/hooks';

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
  const { chainId } = useAccount();

  const urlsByChain: Partial<Record<CHAINS, DappnodeUrls>> = {
    [CHAINS.Mainnet]: {
      brainUrl: 'http://brain.web3signer.dappnode',
      brainKeysUrl: '/api/brain-keys-mainnet',
      brainLaunchpadUrl: '/api/brain-launchpad-mainnet',
      signerUrl: 'http://web3signer.web3signer.dappnode',
      sentinelUrl: 'https://t.me/CSMSentinel_bot',
      stakersUiUrl: 'http://my.dappnode/stakers/ethereum',
      backendUrl: 'http://lido-events.lido-csm-mainnet.dappnode:8080',
      ECApiUrl: 'http://execution.mainnet.dncore.dappnode:8545',
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
      ECApiUrl: 'http://execution.holesky.dncore.dappnode:8545',
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

  const brainUrl = urlsByChain[chainId as CHAINS]?.brainUrl || '';
  const brainKeysUrl = urlsByChain[chainId as CHAINS]?.brainKeysUrl || '';
  const brainLaunchpadUrl =
    urlsByChain[chainId as CHAINS]?.brainLaunchpadUrl || '';
  const signerUrl = urlsByChain[chainId as CHAINS]?.signerUrl || '';
  const sentinelUrl = urlsByChain[chainId as CHAINS]?.sentinelUrl || '';
  const stakersUiUrl = urlsByChain[chainId as CHAINS]?.stakersUiUrl || '';
  const backendUrl = urlsByChain[chainId as CHAINS]?.backendUrl || '';
  const ECApiUrl = urlsByChain[chainId as CHAINS]?.ECApiUrl || '';
  const CCVersionApiUrl = urlsByChain[chainId as CHAINS]?.CCVersionApiUrl || '';
  const CCStatusApiUrl = urlsByChain[chainId as CHAINS]?.CCStatusApiUrl || '';
  const keysStatusUrl = urlsByChain[chainId as CHAINS]?.keysStatusUrl || '';
  const installerTabUrl = (isMainnet: boolean) =>
    urlsByChain[isMainnet ? 1 : 17000]?.installerTabUrl;
  const MEVApiUrl = urlsByChain[chainId as CHAINS]?.MEVApiUrl || '';
  const MEVPackageConfig =
    urlsByChain[chainId as CHAINS]?.MEVPackageConfig || '';

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
