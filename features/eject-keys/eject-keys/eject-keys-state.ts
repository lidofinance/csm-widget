import { KEY_STATUS, type KeyWithStatus } from '@lidofinance/lido-csm-sdk';

export const EJECT_KEYS_FORM_TEST_ID = 'ejectKeysForm';

export const EJECTION_COST_TOOLTIP =
  'Key ejection cost is a network fee required to cover the cost to trigger withdrawal from the Execution layer';

export const EJECTION_REFUND_TOOLTIP =
  'Any excess funds will be automatically refunded to your wallet after the withdrawal is triggered. This process may take some time.';

export const NOT_EJECTABLE_HINT =
  'Only keys that have been active for at least 256 epochs (~27 hours) can be exited';

export const NO_KEYS_TO_EJECT = 'No keys available to eject';

export const NO_KEYS_TO_EJECT_NOTE =
  'Note: Only deposited keys that are eligible for triggerable withdrawals can be ejected. Keys must be deposited and meet withdrawal requirements to appear here.';

export const NOT_NORMAL_EXIT_HEADLINE = 'This is not the normal exit flow.';

export const isNotEjectableKey = ({
  statuses,
}: Pick<KeyWithStatus, 'statuses'>) => !statuses.includes(KEY_STATUS.EJECTABLE);

export const getEjectFee = (
  ejectKeyFee: bigint | undefined,
  count: number,
): bigint | undefined =>
  ejectKeyFee !== undefined && count ? ejectKeyFee * BigInt(count) : undefined;

export const isHighEjectionCost = (fee: bigint, threshold: bigint) =>
  fee >= threshold;
