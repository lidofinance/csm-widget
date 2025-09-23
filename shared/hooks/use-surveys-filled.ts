import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { getExternalLinks } from 'consts/external-links';
import invariant from 'tiny-invariant';
import { standardFetcher } from 'utils';

const { surveyApi } = getExternalLinks();

export const useSurveysFilled = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
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
