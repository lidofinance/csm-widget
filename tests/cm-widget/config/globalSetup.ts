import { EthereumNodeService } from '@lidofinance/wallets-testing-nodes';
import { widgetFullConfig } from './';
import { warmUpForkedNode } from 'tests/shared/helpers/warmUpFork';
import { LidoSDKCm } from '@lidofinance/lido-csm-sdk';
import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import { createPublicClient, http } from 'viem';
import { hoodi } from 'viem/chains';

export default async function globalSetup() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  const secretPhrase = widgetFullConfig.accountConfig.SECRET_PHRASE;
  const forkRpcURL = `http://${widgetFullConfig.standConfig.nodeConfig.host}:${widgetFullConfig.standConfig.nodeConfig.port}`;

  const rpcProvider = createPublicClient({
    chain: hoodi,
    transport: http(forkRpcURL, { timeout: 120_000 }),
  });
  const core = new LidoSDKCore({
    chainId: widgetFullConfig.standConfig.networkConfig.chainId,
    rpcProvider,
  });
  const cmSDK = new LidoSDKCm({ core });
  const nodeConfig = {
    ...widgetFullConfig.standConfig.nodeConfig,
    runOptions: [`--mnemonic=${secretPhrase}`],
    warmUpCallback: warmUpForkedNode.bind(null, cmSDK, secretPhrase),
  };
  const nodeService = new EthereumNodeService(nodeConfig);
  await nodeService.startNode();
}
