import { LidoSDKClient as csmClient } from '../../csm-widget/services/csmSDK.client';
import { LidoSDKClient as cmClient } from '../../cm-widget/services/cmSDK.client';
import { mnemonicToAccount } from 'viem/accounts';
import { FORK_WARM_UP_TIMEOUT } from '../consts/timeouts';

const SLOW_MS = 2000;
const ts = () => new Date().toISOString().slice(11, 23);

const track = async <T>(name: string, value: Promise<T> | T): Promise<T> => {
  const startMs = Date.now();
  try {
    const result = await value;
    const ms = Date.now() - startMs;
    console.info(
      `${ms >= SLOW_MS ? '[warmUp ⚠]' : '[warmUp ✓]'} ${ts()}  ${name}  ${ms}ms`,
    );
    return result;
  } catch (err) {
    const ms = Date.now() - startMs;
    const msg = ((err as Error)?.message ?? String(err)).split('\n')[0];
    console.warn(`[warmUp ✗] ${ts()}  ${name}  ${ms}ms  ${msg}`);
    throw err;
  }
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

      await Promise.all([
        track(
          'getNodeOperatorsByAddress',
          sdk.discovery.getNodeOperatorsByAddress(address),
        ),
        track('getAllNodeOperators', sdk.discovery.getAllNodeOperators()),
        track(
          'getNodeOperatorsByProposedAddress',
          sdk.discovery.getNodeOperatorsByProposedAddress(address),
        ),
        ...('metaRegistry' in sdk
          ? [
              track(
                'metaRegistry.getOperatorTargetStake',
                sdk.metaRegistry.getOperatorTargetStake(1n),
              ),
            ]
          : []),
      ]);

      console.info(`[warmUp] ${ts()}  done in ${Date.now() - callStart}ms`);
      return;
    } catch (error) {
      lastError = error;
      const msg = ((error as Error)?.message ?? String(error)).split('\n')[0];
      console.error(`[warmUp] retry — ${msg}`);
    }
  }
  throw new Error(
    `Timeout (=${FORK_WARM_UP_TIMEOUT}ms) while warming up fork for ${address}. Last error: ${String(lastError)}`,
  );
};
