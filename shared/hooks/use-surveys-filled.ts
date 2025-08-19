import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import invariant from 'tiny-invariant';
import { standardFetcher } from 'utils';
import { useExternalLinks } from './use-external-links';

export const useSurveysFilled = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const { surveyApi } = useExternalLinks();
  const url = nodeOperatorId ? `${surveyApi}/open/csm-${nodeOperatorId}` : null;

  return useQuery({
    queryKey: ['surveys-filled', url],
    queryFn: () => {
      invariant(url);
      return standardFetcher<{ isFilled: boolean }>(url);
    },
    enabled: !!url,
    ...STRATEGY_LAZY,
  });
};
