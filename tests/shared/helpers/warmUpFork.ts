import { LidoSDKClient as csmClient } from '../../csm-widget/services/csmSDK.client';
import { LidoSDKClient as cmClient } from '../../cm-widget/services/cmSDK.client';
import { mnemonicToAccount } from 'viem/accounts';
import { FORK_WARM_UP_TIMEOUT } from '../consts/timeouts';

export const warmUpForkedNode = async (
  csmSDK: csmClient | cmClient,
  secretPhrase: string,
) => {
  const address = mnemonicToAccount(secretPhrase).address;
  const started = Date.now();
  let lastError: unknown;
  while (Date.now() - started < FORK_WARM_UP_TIMEOUT) {
    try {
      await csmSDK.discovery.getNodeOperatorsByProposedAddress(address);
      return;
    } catch (error) {
      lastError = error;
      // @ts-expect-error temp ingnore
      console.error(`Error message: ${error?.message}`);
    }
  }
  throw new Error(
    `Timeout (=${FORK_WARM_UP_TIMEOUT}ms) while waiting node operators for ${address}. Last error: ${String(
      lastError,
    )}`,
  );
};
