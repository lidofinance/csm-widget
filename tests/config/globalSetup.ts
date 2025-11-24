import { EthereumNodeService } from '@lidofinance/wallets-testing-nodes';
import { widgetFullConfig } from 'tests/config';
import { warmUpForkedNode } from 'tests/helpers/warmUpFork';
import { LidoSDKClient } from 'tests/services/csmSDK.client';

export default async function globalSetup() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  const secretPhrase = widgetFullConfig.accountConfig.SECRET_PHRASE;
  const csmSDK = new LidoSDKClient(['http://127.0.0.1:8545']);
  const nodeConfig = {
    ...widgetFullConfig.standConfig.nodeConfig,
    runOptions: [
      `--mnemonic=${secretPhrase}`,
      '--fork-header=Accept-Encoding: identity',
    ],
    warmUpCallback: warmUpForkedNode.bind(null, csmSDK, secretPhrase),
  };
  const nodeService = new EthereumNodeService(nodeConfig);
  await nodeService.startNode();
}
