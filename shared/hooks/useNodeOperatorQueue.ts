import { STRATEGY_EAGER } from 'consts/swr-strategies';
import { useCsmKeysSummary } from './useCsmKeysSummary';

export const useNodeOperatorQueue = (config = STRATEGY_EAGER) => {
  const swr = useCsmKeysSummary(config);

  return { ...swr, data: swr.data?.depositableValidatorsCount };
};
