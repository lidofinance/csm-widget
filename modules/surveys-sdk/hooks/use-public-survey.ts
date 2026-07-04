import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts';
import { surveysKeys } from './query-keys';

// Public survey query — no token, no auth-error dispatch, callable from any
// context (no SiweAuthProvider needed). Thunk-based successor to the path-string
// version: instead of `surveysGet(path)` the caller supplies `makeRequest`, a
// thunk that runs a generated SDK call through `callSurvey` (e.g.
// `({ signal }) => callSurvey(() => openIndex({ ...surveyRequest(undefined, signal), path }))`).
//
// Kept OFF `useSurveyQuery` on purpose: that hook injects a token, appends it to
// the key, defaults `enabled` to `!!token`, and dispatches auth errors — none of
// which apply to a public endpoint. Here the caller owns the stable public
// `path` (used to build the `surveysKeys.public(path)` key + the `enabled` gate)
// while the thunk owns the typed transport.
type SurveyRequestArgs = {
  signal?: AbortSignal;
};

export const usePublicSurvey = <T>(
  path: string | null,
  makeRequest: (args: SurveyRequestArgs) => Promise<T | undefined>,
): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: surveysKeys.public(path ?? ''),
    queryFn: async ({ signal }) => (await makeRequest({ signal })) as T,
    enabled: Boolean(path),
    ...STRATEGY_LAZY,
  });
};
