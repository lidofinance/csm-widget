import { config } from 'config';
import { getExternalLinks } from 'consts/external-links';
import type { SiweSigninPayload, SiweSigninResponse } from 'modules/siwe';
import invariant from 'tiny-invariant';
import { FetcherError } from 'utils/fetcher-error';
import { standardFetcher } from 'utils/standard-fetcher';
import { endpoints } from './endpoints';
import { SurveysApiError } from './errors';
import type { SurveysFetchOptions } from './types';
import { appendQuery, joinUrl } from './url';

// Resolved once at module load. Read order: `process.env.SURVEYS_API_URL`
// (via env-dynamics) → per-chain `getExternalLinks().surveyApi` default.
// May be undefined when surveys are disabled in this env; transport invariants.
export const SURVEYS_API_BASE_URL: string | undefined =
  config.surveysApiUrl ?? getExternalLinks().surveyApi;

export const isSurveysApiConfigured = Boolean(SURVEYS_API_BASE_URL);

const buildHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = token;
  return headers;
};

const surveysRequest = async <T>(
  path: string,
  init: RequestInit,
  opts: SurveysFetchOptions = {},
): Promise<T> => {
  invariant(
    SURVEYS_API_BASE_URL,
    'surveys-sdk: SURVEYS_API_BASE_URL is not configured (set SURVEYS_API_URL env or surveyApi external link)',
  );
  const url = appendQuery(joinUrl(SURVEYS_API_BASE_URL, path), opts.query);

  try {
    return await standardFetcher<T>(url, {
      ...init,
      headers: buildHeaders(opts.token),
      signal: opts.signal,
    });
  } catch (err) {
    if (err instanceof FetcherError) {
      if (opts.token && (err.status === 401 || err.status === 403)) {
        opts.onAuthError?.();
      }
      throw new SurveysApiError({
        message: err.message,
        status: err.status,
        url,
        cause: err,
      });
    }
    throw err;
  }
};

export const surveysGet = <T>(
  path: string,
  opts: SurveysFetchOptions = {},
): Promise<T> => surveysRequest<T>(path, { method: 'GET' }, opts);

export const surveysPost = <T, B = unknown>(
  path: string,
  body: B,
  opts: SurveysFetchOptions = {},
): Promise<T> =>
  surveysRequest<T>(path, { method: 'POST', body: JSON.stringify(body) }, opts);

export const surveysDelete = <T = void>(
  path: string,
  opts: SurveysFetchOptions = {},
): Promise<T> => surveysRequest<T>(path, { method: 'DELETE' }, opts);

// Public signin endpoint — accepts no token. Pass directly to <SiweAuthProvider signin={...}>.
export const surveysSignin = (
  payload: SiweSigninPayload,
): Promise<SiweSigninResponse> =>
  surveysPost<SiweSigninResponse>(endpoints.signin, payload);
