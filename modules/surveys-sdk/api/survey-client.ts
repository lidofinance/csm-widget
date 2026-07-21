import invariant from 'tiny-invariant';
import { createClient } from '../generated/client';
import type { Client } from '../generated/client';
import { SURVEYS_API_BASE_URL } from './surveys-api';
import { SurveysApiError } from './errors';

// ─────────────────────────────────────────────────────────────────────────────
// The single configured hey-api client for the CSM Survey API.
//
// This reproduces the bespoke transport in `surveys-api.ts` (surveysRequest +
// standardFetcher) on top of the generated `@hey-api/client-fetch` runtime,
// WITHOUT switching any hooks yet. T5 rewires the hooks onto `callSurvey` and
// retires the old transport; until then both paths coexist.
//
// What this layer owns (transport parity):
//   • baseUrl       — the SAME `SURVEYS_API_BASE_URL` constant (not re-derived);
//                     the unconfigured invariant is preserved per request.
//   • empty body    — 204 / Content-Length:0 resolves to `undefined`, matching
//                     standardFetcher. client-fetch alone returns `{}` here, so
//                     we normalize in `callSurvey` using the raw Response.
//   • error mapping — any non-2xx surfaces a `SurveysApiError` carrying the same
//                     `{ message, status, url, body, cause }` as today, built in
//                     the error interceptor where the Response is available.
//   • headers       — `Content-Type: application/json` on body-bearing requests
//                     (client default; client-fetch strips it on bodiless
//                     requests, which is more correct than the old transport's
//                     unconditional header) plus a verbatim bearer
//                     `Authorization` header when a token is supplied (see note
//                     on auth below).
//
// What this layer does NOT own (deferred to T5):
//   • onAuthError / handleAuthError dispatch. That depends on the hook-level
//     token + SIWE callback, so it moves into the hooks. They classify the
//     thrown error with the existing `authErrorKind(err)` — which reads
//     `.apiError`/`.status` off the SurveysApiError this layer throws. We make
//     sure the thrown error carries everything that classifier needs; we do not
//     fire the callback here.
//
// Auth note: we pass the token verbatim as the `Authorization` header rather
// than via the SDK's `security`/`auth` mechanism. The generated SDK marks bearer
// endpoints with `security: [{ scheme: 'bearer' }]`, and the client's
// `getAuthToken` would prepend `Bearer ` to whatever it resolves. The existing
// callers already pass a fully-formed header value (`${token_type} ${access_token}`,
// e.g. `Bearer xyz`), so re-prefixing would corrupt it. Setting the header
// directly preserves the verbatim `Authorization` value `buildHeaders` produced.
// ─────────────────────────────────────────────────────────────────────────────

// `throwOnError: true` makes the client throw on non-2xx (instead of returning
// `{ error }`); the error interceptor below converts that throw into a
// SurveysApiError. `responseStyle: 'fields'` gives us the raw Response in the
// result so `callSurvey` can detect empty bodies — set explicitly because the
// runtime default is `undefined`, and `callSurvey` hard-destructures
// `{ data, response }`, so a regen flipping the default to `'data'` would
// silently break every call.
export const surveyClient: Client = createClient({
  baseUrl: SURVEYS_API_BASE_URL,
  throwOnError: true,
  responseStyle: 'fields',
});

// Map a non-2xx into a SurveysApiError carrying the same data as the bespoke
// transport. The raw `error` is client-fetch's pre-throw value: the parsed JSON
// envelope when the body was JSON, else the raw text (or undefined). That maps
// to `body` exactly like standardFetcher's `readError` + surveysRequest's catch.
// `response`/`request` are present for any HTTP-level failure; they're undefined
// only for a pre-flight failure (e.g. a network error building the request),
// which we still surface as a SurveysApiError so callers see one error type.
surveyClient.interceptors.error.use((error, response, request) => {
  // Already mapped (e.g. nested rethrow) — pass through untouched.
  if (error instanceof SurveysApiError) return error;

  const status = response?.status ?? 0;
  const url = response?.url ?? request?.url ?? '';
  const message = extractMessage(error) ?? 'An error occurred';

  return new SurveysApiError({
    message,
    status,
    url,
    body: error,
    cause: error,
  });
});

// Pull a human message out of the parsed error body, mirroring the intent of
// utils/extract-error-message (envelope `message` field) without importing the
// widget runtime into this transport leaf.
const extractMessage = (body: unknown): string | undefined => {
  if (typeof body === 'string') return body || undefined;
  if (
    body &&
    typeof body === 'object' &&
    'message' in body &&
    typeof (body as { message: unknown }).message === 'string'
  ) {
    return (body as { message: string }).message;
  }
  return undefined;
};

// Per-request wiring the caller spreads into a generated SDK function: always
// the configured `client`, `throwOnError: true` (so the result is `{ data,
// response }` and the error interceptor fires), and — when authenticating — a
// verbatim bearer `Authorization` header. Build it with `surveyRequest()`.
//
// Why a thunk-based `callSurvey` (caller invokes the SDK fn) rather than
// `callSurvey(fn, params)`: the generated SDK functions are generic over
// `ThrowOnError`, and wrapping one in a generic helper leaves that parameter
// free at the helper's call site. Resolving the SDK's deeply-conditional
// `RequestResult` return against a *free* `ThrowOnError` crashes tsc 5.7 with an
// internal "No error for last overload signature" failure. Calling the SDK fn
// directly with a literal `throwOnError: true` pins the conditional and is
// stable — and it keeps full request (`path`/`body`/`query`) AND response type
// inference, which a loosely-typed `fn` parameter would lose. See T4 notes.
type SurveyRequestInit = {
  client: Client;
  throwOnError: true;
  signal?: AbortSignal;
  headers?: { Authorization: string };
};

// The resolved success shape a generated SDK function returns when called with
// `throwOnError: true`: the parsed body plus the raw Response (used to detect
// empty bodies).
type SurveyResult<TData> = { data: TData; response: Response };

// Build the per-request wiring to spread into a generated SDK call. Pass the
// verbatim bearer header value (`${token_type} ${access_token}`) as `token` for
// authenticated endpoints; omit it for public ones.
//
//   await callSurvey(() =>
//     contactsFindOne({ ...surveyRequest(token), path: { nodeOperatorId } }),
//   );
export const surveyRequest = (
  token?: string,
  signal?: AbortSignal,
): SurveyRequestInit => ({
  client: surveyClient,
  throwOnError: true,
  signal,
  ...(token ? { headers: { Authorization: token } } : undefined),
});

// Run a generated survey SDK call and reproduce standardFetcher's return
// contract: a 204 / empty body resolves to `undefined`; otherwise the parsed
// JSON data. Non-2xx throws a SurveysApiError via the error interceptor above.
// The caller supplies a thunk that invokes the SDK fn (with `surveyRequest(...)`
// spread in) so request/response types stay fully inferred — see the note on
// `SurveyRequestInit` for why we don't take `(fn, params)` directly.
export const callSurvey = async <TData>(
  run: () => Promise<SurveyResult<TData>>,
): Promise<TData | undefined> => {
  // Preserve the bespoke transport invariant: a request issued while the API is
  // unconfigured must fail clearly rather than hit a relative URL. (The client's
  // baseUrl is the same possibly-undefined constant.)
  invariant(
    SURVEYS_API_BASE_URL,
    'surveys-sdk: SURVEYS_API_BASE_URL is not configured (set SURVEYS_API_URL env or surveyApi external link)',
  );

  const { data, response } = await run();

  // standardFetcher contract: empty body → undefined. client-fetch yields `{}`
  // here, so detect the empty case from the raw Response and normalize.
  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return undefined;
  }

  return data;
};
