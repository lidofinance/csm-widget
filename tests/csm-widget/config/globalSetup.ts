import { widgetFullConfig } from './';
import { warmUpForkedNode } from 'tests/shared/helpers/warmUpFork';
import { LidoSDKClient } from 'tests/csm-widget/services/csmSDK.client';
import {
  startForkNode,
  assertForkReachable,
} from 'tests/shared/services/forkNode.service';

export default async function globalSetup() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  const secretPhrase = widgetFullConfig.accountConfig.SECRET_PHRASE;
  const { host, rpcUrl } = widgetFullConfig.standConfig.nodeConfig;
  const port = Number(widgetFullConfig.standConfig.nodeConfig.port);
  const forkRpcURL = `http://${host}:${port}`;

  if (process.env.CI) {
    await startForkNode({
      forkUrl: rpcUrl,
      mnemonic: secretPhrase,
      port,
      host,
    });
  }
  await assertForkReachable(forkRpcURL);

  const csmSDK = new LidoSDKClient([forkRpcURL]);
  await warmUpForkedNode(csmSDK, secretPhrase);
}
