import { useLidoSWR } from '@lido-sdk/react';
import { getExternalLinks } from 'consts/external-links';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { NodeOperatorId } from 'types';
import { standardFetcher } from 'utils';

const { surveyApi } = getExternalLinks();

export const useSurveysFilled = (nodeOperatorId?: NodeOperatorId) => {
  const url = nodeOperatorId ? `${surveyApi}/open/csm-${nodeOperatorId}` : null;

  return useLidoSWR(
    url,
    url ? standardFetcher<{ isFilled: boolean }> : null,
    STRATEGY_LAZY,
  );
};
