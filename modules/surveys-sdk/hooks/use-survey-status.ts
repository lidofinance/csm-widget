import { useDappStatus } from 'modules/web3';
import { surveysKeys } from './query-keys';
import { useSurveyQuery } from './use-survey-query';

type StatusRequestArgs = { token?: string; signal?: AbortSignal };

// Shared wiring for the auth-gated `*/status` survey endpoints (ICS, IDVTC):
// builds the address-scoped query key from useDappStatus and maps the server's
// `null` "no submission" sentinel to `undefined`. The caller supplies the
// request thunk (a direct generated SDK call through callSurvey) so the SDK's
// `throwOnError` generic stays pinned — see the note in survey-client.ts.
export const useSurveyStatus = <T>(
  pathKey: string,
  makeRequest: (args: StatusRequestArgs) => Promise<T | null | undefined>,
) => {
  const { address } = useDappStatus();
  return useSurveyQuery<T | null, T | undefined>(
    surveysKeys.authPath(pathKey, address),
    makeRequest,
    { select: (status) => status ?? undefined },
  );
};
