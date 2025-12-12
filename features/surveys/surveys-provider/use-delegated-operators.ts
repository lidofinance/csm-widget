import { useQuery } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { useSurveysFetcher } from '../shared/use-surveys-fetcher';
import { DelegatedOperatorsResponse } from '../types';

export const useDelegatedOperators = (nodeOperatorId?: bigint) => {
  const excludeId =
    nodeOperatorId !== undefined ? `csm-${nodeOperatorId}` : undefined;

  const [fetcher] = useSurveysFetcher<DelegatedOperatorsResponse>();

  return useQuery({
    queryKey: ['surveys', 'delegates/my'],
    queryFn: () => fetcher('delegates/my'),
    ...STRATEGY_LAZY,
    select: (data) => data.nodeOperatorIds.filter((id) => id !== excludeId),
  });
};
