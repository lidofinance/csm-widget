import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const TYPE_QUERY_MAP: Record<string, OPERATOR_TYPE> = {
  ics: OPERATOR_TYPE.CSM_ICS,
  idvtc: OPERATOR_TYPE.CSM_IDVTC,
  def: OPERATOR_TYPE.CSM_DEF,
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
