import { EthereumNodeService } from '@lidofinance/wallets-testing-nodes';
import { widgetFullConfig } from './';
import { warmUpForkedNode } from 'tests/shared/helpers/warmUpFork';
import { LidoSDKClient } from 'tests/cm-widget/services/cmSDK.client';

export default async function globalSetup() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  const secretPhrase = widgetFullConfig.accountConfig.SECRET_PHRASE;
  const forkRpcURL = `http://${widgetFullConfig.standConfig.nodeConfig.host}:${widgetFullConfig.standConfig.nodeConfig.port}`;
  const cmSDK = new LidoSDKClient([forkRpcURL], null as never);
  const nodeConfig = {
    ...widgetFullConfig.standConfig.nodeConfig,
    runOptions: [`--mnemonic=${secretPhrase}`],
    warmUpCallback: warmUpForkedNode.bind(null, cmSDK, secretPhrase),
  };
  const nodeService = new EthereumNodeService(nodeConfig);
  await nodeService.startNode();
}
