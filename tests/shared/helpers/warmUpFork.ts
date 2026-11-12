// Relative .ts imports and no path aliases: the QA panel runs this under
// plain node (tests/scripts/qa-panel/server.ts)
import { randomBytes } from 'node:crypto';
import { toHex, type Address } from 'viem';
import { AccountingAbi, BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import { mnemonicToAccount } from 'viem/accounts';
import type {
  LidoSDKCm,
  LidoSDKCsm,
  LidoSDKCsm02,
  NodeOperatorId,
} from '@lidofinance/lido-csm-sdk';
import { KEYS_UPLOAD_TX_LIMIT } from '../../../consts/keys.ts';
import type { ForkActionsService } from '../contracts/forkActions.service.ts';
import { FORK_WARM_UP_TIMEOUT } from '../consts/timeouts.ts';

type Sdk = LidoSDKCsm | LidoSDKCsm02 | LidoSDKCm;
type Log = (line: string) => void;

const SLOW_MS = 2000;
const ts = () => new Date().toISOString().slice(11, 23);

const tracker =
  (log: Log = console.info) =>
  async <T>(name: string, value: Promise<T> | T): Promise<T> => {
    const startMs = Date.now();
    try {
      const result = await value;
      const ms = Date.now() - startMs;
      log(
        `${ms >= SLOW_MS ? '[warmUp ⚠]' : '[warmUp ✓]'} ${ts()}  ${name}  ${ms}ms`,
      );
      return result;
    } catch (err) {
      const ms = Date.now() - startMs;
      const msg = ((err as Error)?.message ?? String(err)).split('\n')[0];
      log(`[warmUp ✗] ${ts()}  ${name}  ${ms}ms  ${msg}`);
      throw err;
    }
  };

const warmUpKeysEvents = async (
  sdk: Sdk,
  nodeOperatorId: NodeOperatorId,
  track: ReturnType<typeof tracker>,
) => {
  const options = { maxBlocksDepth: undefined };
  await Promise.all([
    track(
      `events.getWithdrawalSubmittedKeys(#${nodeOperatorId})`,
      sdk.events.getWithdrawalSubmittedKeys(nodeOperatorId, options),
    ),
    track(
      `events.getRequestedToExitKeys(#${nodeOperatorId})`,
      sdk.events.getRequestedToExitKeys(nodeOperatorId, options),
    ),
    track(
      `events.getTriggeredEjectionKeys(#${nodeOperatorId})`,
      sdk.events.getTriggeredEjectionKeys(nodeOperatorId, options),
    ),
  ]);
};

export const warmUpForkedNode = (sdk: Sdk, secretPhrase: string) =>
  warmUpAddress(sdk, mnemonicToAccount(secretPhrase).address);

/** Returns the number of the address's operators */
export const warmUpAddress = async (
  sdk: Sdk,
  address: Address,
  log: Log = console.info,
) => {
  const track = tracker(log);
  const started = Date.now();
  let lastError: unknown;
  while (Date.now() - started < FORK_WARM_UP_TIMEOUT) {
    try {
      const callStart = Date.now();

      const [operators] = await Promise.all([
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

      // Same operator ids the widget queries, so the topic filters match
      log(`[warmUp] ${ts()}  keys events for ${operators.length} operator(s)`);
      await Promise.all(
        operators.map(({ nodeOperatorId }) =>
          warmUpKeysEvents(sdk, nodeOperatorId, track),
        ),
      );

      log(`[warmUp] ${ts()}  done in ${Date.now() - callStart}ms`);
      return operators.length;
    } catch (error) {
      lastError = error;
      const msg = ((error as Error)?.message ?? String(error)).split('\n')[0];
      log(`[warmUp] retry — ${msg}`);
    }
  }
  throw new Error(
    `Timeout (=${FORK_WARM_UP_TIMEOUT}ms) while warming up fork for ${address}. Last error: ${String(lastError)}`,
  );
};

export const warmUpSubmitKeys = async (
  fork: ForkActionsService,
  address: `0x${string}`,
  noId: number,
) => {
  const track = tracker();
  const count = BigInt(KEYS_UPLOAD_TX_LIMIT);

  const value = await track(
    `getRequiredBondForNextKeys(#${noId}, ${KEYS_UPLOAD_TX_LIMIT})`,
    fork.client.readContract({
      address: fork.addresses.accounting,
      abi: AccountingAbi,
      functionName: 'getRequiredBondForNextKeys',
      args: [BigInt(noId), count],
    }),
  );

  await track(
    `simulate addValidatorKeysETH(#${noId}, ${KEYS_UPLOAD_TX_LIMIT})`,
    fork.client.simulateContract({
      address: fork.addresses.module,
      abi: BaseModuleAbi,
      functionName: 'addValidatorKeysETH',
      args: [
        address,
        BigInt(noId),
        count,
        toHex(randomBytes(48 * KEYS_UPLOAD_TX_LIMIT)),
        toHex(randomBytes(96 * KEYS_UPLOAD_TX_LIMIT)),
      ],
      account: address,
      value,
    }),
  );
};
