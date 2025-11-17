import { LidoSDKClient } from 'tests/services/csmSDK.client';
import { mnemonicToAccount } from 'viem/accounts';
import { FORK_WARM_UP_TIMEOUT } from 'tests/consts/timeouts';

export const warmUpForkedNode = async (
  csmSDK: LidoSDKClient,
  secretPhrase: string,
) => {
  const address = mnemonicToAccount(secretPhrase).address;
  const started = Date.now();
  let lastError: unknown;
  while (Date.now() - started < FORK_WARM_UP_TIMEOUT) {
    try {
      await csmSDK.satellite.getNodeOperatorsByAddress(address);
      await csmSDK.satellite.getNodeOperatorsByProposedAddress(address);
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
