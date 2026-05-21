import { LidoSDKClient as csmClient } from '../../csm-widget/services/csmSDK.client';
import { LidoSDKClient as cmClient } from '../../cm-widget/services/cmSDK.client';
import { mnemonicToAccount } from 'viem/accounts';
import { FORK_WARM_UP_TIMEOUT } from '../consts/timeouts';

const warmUpGates = (sdk: cmClient, address: `0x${string}`) => {
  const gates = sdk.curatedGates.getAll();
  return Promise.all(
    gates.flatMap((gate) => [
      gate.getCurveId(),
      gate.isPaused(),
      gate.getTreeConfig(),
      gate.isConsumed(address),
    ]),
  );
};

export const warmUpForkedNode = async (
  sdk: csmClient | cmClient,
  secretPhrase: string,
) => {
  const address = mnemonicToAccount(secretPhrase).address;
  const started = Date.now();
  let lastError: unknown;
  while (Date.now() - started < FORK_WARM_UP_TIMEOUT) {
    try {
      const callStart = Date.now();
      const warmUpTasks: Promise<unknown>[] = [
        sdk.discovery.getAllNodeOperators(),
        sdk.discovery.getNodeOperatorsByAddress(address),
        sdk.discovery.getNodeOperatorsByProposedAddress(address),
        sdk.module.getDigest(),
        sdk.parameters.getAll(0n),
      ];
      if ('curatedGates' in sdk) {
        warmUpTasks.push(warmUpGates(sdk, address));
      }
      await Promise.all(warmUpTasks);
      console.info(`[warmUp] Fork warmed up in ${Date.now() - callStart}ms`);
      return;
    } catch (error) {
      lastError = error;
      // @ts-expect-error temp ingnore
      console.error(`Error message: ${error?.message}`);
    }
  }
  throw new Error(
    `Timeout (=${FORK_WARM_UP_TIMEOUT}ms) while warming up fork for ${address}. Last error: ${String(lastError)}`,
  );
};
