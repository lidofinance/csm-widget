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

export const joinUrl = (baseUrl: string, path: string): string => {
  const base = baseUrl.replace(/\/+$/, '');
  const tail = path.replace(/^\/+/, '');
  return `${base}/${tail}`;
};

export const appendQuery = (
  url: string,
  query?: Record<string, string | number | boolean | undefined>,
): string => {
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined) continue;
    params.append(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
};
