import { EthereumNodeService } from '@lidofinance/wallets-testing-nodes';
import { widgetFullConfig } from '../csm-widget/config';

export default async function globalTeardown() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  await EthereumNodeService.forceStopNode(
    widgetFullConfig.standConfig.nodeConfig.port as number,
  );
}
