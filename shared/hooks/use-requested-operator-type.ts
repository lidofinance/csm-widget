import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { useRouter } from 'next/router';

import { useCanCreateNodeOperator } from './use-can-create-node-operator';

const OPERATOR_TYPE_QUERY: Partial<Record<OPERATOR_TYPE, string>> = {
  [OPERATOR_TYPE.CSM_ICS]: 'ics',
  [OPERATOR_TYPE.CSM_IDVTC]: 'idvtc',
  [OPERATOR_TYPE.CSM_DEF]: 'def',
  [OPERATOR_TYPE.CSM2_DEF]: '0x02',
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

/** Operator type preselected via `?type=`, honored only when that type is actually creatable. */
export const useRequestedOperatorType = (): OPERATOR_TYPE | undefined => {
  const { query } = useRouter();
  const { creatableTypes } = useCanCreateNodeOperator();

  const raw = query.type;
  const requested =
    typeof raw === 'string' ? TYPE_QUERY_MAP[raw.toLowerCase()] : undefined;

  return requested && creatableTypes.includes(requested)
    ? requested
    : undefined;
};
