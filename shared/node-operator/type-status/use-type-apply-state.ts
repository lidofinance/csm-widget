import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { UseQueryResult } from '@tanstack/react-query';
import { OperatorTypeStatus, useOperatorTypeStatus } from 'modules/web3';
import { useCallback, useMemo, useState } from 'react';
import { ApplicationStatus } from './types';

export type TypeApplyState<Dto> = {
  typeStatus: OperatorTypeStatus;
  hasOperator: boolean;
  data?: Dto;
  isPending: boolean;
  isTypePending: boolean;
  isButtonPending: boolean;
  applyMode: boolean;
  reset: (value?: boolean) => void;
};

export const useTypeApplyState = <Dto extends { status: ApplicationStatus }>(
  targetType: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC,
  surveyQuery: Pick<
    UseQueryResult<Dto | undefined>,
    'data' | 'isPending' | 'isLoading'
  >,
): TypeApplyState<Dto> => {
  const {
    typeStatus,
    hasOperator,
    isPending: isTypePending,
  } = useOperatorTypeStatus(targetType);
  const { data, isPending } = surveyQuery;

  const [manualReset, setManualReset] = useState(false);
  const reset = useCallback((value = true) => setManualReset(value), []);
  const applyMode = manualReset || !data;

  // isLoading, not isPending: the query is disabled without a SIWE token
  const isButtonPending =
    isTypePending || (typeStatus === 'PENDING' && surveyQuery.isLoading);

  return useMemo(
    () => ({
      typeStatus,
      hasOperator,
      data,
      isPending,
      isTypePending,
      isButtonPending,
      applyMode,
      reset,
    }),
    [
      typeStatus,
      hasOperator,
      data,
      isPending,
      isTypePending,
      isButtonPending,
      applyMode,
      reset,
    ],
  );
};
