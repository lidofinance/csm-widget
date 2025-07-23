import { useQuery } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { getExternalLinks } from 'consts/external-links';
import { useNodeOperatorId } from 'modules/web3';
import invariant from 'tiny-invariant';
import { standardFetcher } from 'utils';

const { surveyApi } = getExternalLinks();

export const useSurveysFilled = () => {
  const nodeOperatorId = useNodeOperatorId();
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
