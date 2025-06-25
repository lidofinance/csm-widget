import { useLidoSWR } from '@lido-sdk/react';
import { getExternalLinks } from 'consts/external-links';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { standardFetcher } from 'utils';

const { surveyApi } = getExternalLinks();

export const useSurveysFilled = () => {
  const nodeOperatorId = useNodeOperatorId();
  const url = nodeOperatorId ? `${surveyApi}/open/csm-${nodeOperatorId}` : null;

  return useLidoSWR(
    url,
    url ? standardFetcher<{ isFilled: boolean }> : null,
    STRATEGY_LAZY,
  );
};
