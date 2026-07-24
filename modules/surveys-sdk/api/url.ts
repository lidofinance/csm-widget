import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import type { OperatorKey } from './types';

type OperatorKeyFn = {
  (module: MODULE_NAME, id: bigint): OperatorKey;
  (module: MODULE_NAME, id: bigint | undefined): OperatorKey | undefined;
};

export const operatorKey: OperatorKeyFn = (
  module: MODULE_NAME,
  id: bigint | undefined,
) =>
  (id === undefined
    ? undefined
    : `${module.toLowerCase()}-${id}`) as OperatorKey;

const OPERATOR_KEY_RE = /^(csm|cm)-(\d+)$/;

export const parseOperatorKey = (s: string): OperatorKey | null =>
  OPERATOR_KEY_RE.test(s) ? (s as OperatorKey) : null;
