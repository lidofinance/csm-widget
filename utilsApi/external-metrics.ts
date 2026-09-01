import { FetcherError } from 'utils/fetcher-error';
import Metrics from './metrics/metrics';

const getHostname = (target: string) => {
  try {
    return new URL(target).hostname;
  } catch {
    return 'invalid';
  }
};

type ExternalRequestArgs<T> = {
  /** Absolute URL of the target — only its hostname is used as a label. */
  target: string;
  route: string;
  entity?: string;
  request: () => Promise<T>;
};

/** Records latency, count and outcome of an outgoing request to a third-party API. */
export const responseTimeExternalMetricWrapper = async <T>({
  target,
  route,
  entity = 'external',
  request,
}: ExternalRequestArgs<T>): Promise<T> => {
  const endMetric = Metrics.request.apiTimingsExternal.startTimer({
    hostname: getHostname(target),
    route,
    entity,
  });

  try {
    const result = await request();
    endMetric({ status: '2xx' });
    return result;
  } catch (error) {
    const isClientError =
      error instanceof FetcherError &&
      error.status >= 400 &&
      error.status < 500;
    endMetric({ status: isClientError ? '4xx' : '5xx' });
    throw error;
  }
};
