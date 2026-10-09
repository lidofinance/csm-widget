import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import type { OperatorKey, OperatorKeyPrefix } from './types';

type OperatorKeyFn = {
  (module: MODULE_NAME, id: bigint): OperatorKey;
  (module: MODULE_NAME, id: bigint | undefined): OperatorKey | undefined;
};

// Keyed by enum value (not `MODULE_NAME.X`) so jest need not load the SDK.
const API_PREFIX: Record<`${MODULE_NAME}`, OperatorKeyPrefix> = {
  CSM: 'csm',
  CSM_02: 'csm02',
  CM: 'cm',
};

export const operatorKey: OperatorKeyFn = (
  module: MODULE_NAME,
  id: bigint | undefined,
) =>
  (id === undefined ? undefined : `${API_PREFIX[module]}-${id}`) as OperatorKey;

const OPERATOR_KEY_RE = /^(csm|csm02|cm)-(\d+)$/;

export const parseOperatorKey = (s: string): OperatorKey | null =>
  OPERATOR_KEY_RE.test(s) ? (s as OperatorKey) : null;
