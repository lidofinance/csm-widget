import { EthereumNodeService } from '@lidofinance/wallets-testing-nodes';
import { widgetFullConfig } from '../csm-widget/config';
import { warmUpForkedNode } from './helpers/warmUpFork';
import { LidoSDKClient } from '../csm-widget/services/csmSDK.client';

export default async function globalSetup() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  const secretPhrase = widgetFullConfig.accountConfig.SECRET_PHRASE;
  const forkRpcURL = `http://${widgetFullConfig.standConfig.nodeConfig.host}:${widgetFullConfig.standConfig.nodeConfig.port}`;
  const csmSDK = new LidoSDKClient([forkRpcURL]);
  const nodeConfig = {
    ...widgetFullConfig.standConfig.nodeConfig,
    runOptions: [`--mnemonic=${secretPhrase}`],
    warmUpCallback: warmUpForkedNode.bind(null, csmSDK, secretPhrase),
  };
  const nodeService = new EthereumNodeService(nodeConfig);
  await nodeService.startNode();
}
