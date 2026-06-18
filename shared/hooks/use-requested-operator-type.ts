import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const OPERATOR_TYPE_QUERY: Partial<Record<OPERATOR_TYPE, string>> = {
  [OPERATOR_TYPE.CSM_ICS]: 'ics',
  [OPERATOR_TYPE.CSM_IDVTC]: 'idvtc',
  [OPERATOR_TYPE.CSM_DEF]: 'def',
};

const TYPE_QUERY_MAP = Object.fromEntries(
  Object.entries(OPERATOR_TYPE_QUERY).map(([type, key]) => [key, type]),
) as Record<string, OPERATOR_TYPE>;

// Builds the `?type=` query that preselects an operator type (and its curve)
// on the create page. Returns undefined for types without a create flow.
export const getOperatorTypeQuery = (
  type: OPERATOR_TYPE,
): Record<string, string> | undefined => {
  const key = OPERATOR_TYPE_QUERY[type];
  return key ? { type: key } : undefined;
};

export type RequestedOperatorType =
  | { isRequested: false; type?: undefined }
  | { isRequested: true; type: OPERATOR_TYPE | undefined };

export const useRequestedOperatorType = (): RequestedOperatorType => {
  const { query } = useRouter();
  const raw = query.type;

  return useMemo(() => {
    if (typeof raw !== 'string') return { isRequested: false };
    return { isRequested: true, type: TYPE_QUERY_MAP[raw.toLowerCase()] };
  }, [raw]);
};
