import { EthereumNodeService } from '@lidofinance/wallets-testing-nodes';
import { widgetFullConfig } from './';
import { warmUpForkedNode } from 'tests/shared/helpers/warmUpFork';
import { LidoSDKClient } from 'tests/csm-widget/services/csmSDK.client';
import { IpfsNodeService } from 'tests/shared/services/ipfsNode.service';
import { setupPresets } from 'tests/shared/config/walletSetup';
import type { ChainName } from 'tests/shared/contracts/constants';
import { walletSetup } from './walletSetup';

export default async function globalSetup() {
  if (process.env.CI) {
    await new IpfsNodeService().start();
  } else {
    console.info(
      `[globalSetup] You are using local IPFS node, make sure you have it running on ${widgetFullConfig.standConfig.ipfsConfig.gateway}`,
    );
  }

  const { nodeConfig, keysGeneratorConfig } = widgetFullConfig.standConfig;
  const forkRpcURL = `http://${nodeConfig.host}:${nodeConfig.port}`;

  if (process.env.CI) {
    const secretPhrase = widgetFullConfig.accountConfig.SECRET_PHRASE;
    const sdk = new LidoSDKClient([forkRpcURL]);
    const nodeService = new EthereumNodeService({
      ...nodeConfig,
      runOptions: [`--mnemonic=${secretPhrase}`],
      warmUpCallback: warmUpForkedNode.bind(null, sdk, secretPhrase),
    });
    await nodeService.startNode();
  }

  await setupPresets(walletSetup, {
    rpcUrl: forkRpcURL,
    chain: keysGeneratorConfig.chain as ChainName,
  });
}
