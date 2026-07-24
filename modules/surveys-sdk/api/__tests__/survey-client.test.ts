// Parity tests for the configured hey-api survey client (api/survey-client.ts).
// They prove `callSurvey` + `surveyRequest` reproduce the bespoke transport
// (surveysRequest + standardFetcher) it will replace in T5: parsed JSON on
// success, `undefined` on empty bodies, and a SurveysApiError carrying
// { status, url, body, code, details } on non-2xx — plus correct bearer-header
// behavior and base-URL/query joining.
//
// We mock the global `fetch` with Response-like objects shaped exactly how the
// bundled client-fetch runtime consumes them (.ok/.status/.url/.headers.get/
// .text/.json). The same `config`/`external-links` mocks as surveys-api.test.ts
// make SURVEYS_API_BASE_URL resolve to https://surveys.test.

jest.mock('config', () => ({
  config: { surveysApiUrl: 'https://surveys.test' },
}));

jest.mock('consts/external-links', () => ({
  getExternalLinks: () => ({ surveyApi: 'https://default.test' }),
}));

import {
  contactsFindOne,
  contactsUpdate,
  contactsDeleteOne,
  openIndex,
} from '../../generated';
import { callSurvey, surveyClient, surveyRequest } from '../survey-client';
import { SurveysApiError, authErrorKind } from '../errors';

type FetchResponseInit = {
  status: number;
  body?: unknown;
  /** Raw header map; `content-type` defaults to application/json. */
  headers?: Record<string, string>;
};

// Build a minimal Response-like the client-fetch runtime understands. It reads
// the body via `.text()` (then JSON.parses), infers parsing from Content-Type,
// and checks Content-Length for the empty-body branch.
const makeResponse = (
  init: FetchResponseInit,
  url = 'https://surveys.test/x',
): Response => {
  const headers = new Headers({
    'content-type': 'application/json',
    ...init.headers,
  });
  const text =
    init.body === undefined
      ? ''
      : typeof init.body === 'string'
        ? init.body
        : JSON.stringify(init.body);
  return {
    ok: init.status >= 200 && init.status < 300,
    status: init.status,
    url,
    headers,
    text: jest.fn().mockResolvedValue(text),
    json: jest.fn().mockResolvedValue(init.body),
  } as unknown as Response;
};

// Install a fetch mock returning `response` for any request. Returns the mock
// so tests can assert on the Request it received.
const installFetch = (response: Response): jest.Mock => {
  const fetchMock = jest.fn().mockResolvedValue(response);
  (globalThis as unknown as { fetch: jest.Mock }).fetch = fetchMock;
  return fetchMock;
};

// The client builds a `Request`; pull the resolved URL/headers off it.
const lastRequest = (fetchMock: jest.Mock): Request =>
  fetchMock.mock.calls[fetchMock.mock.calls.length - 1][0] as Request;

// Run a thunk that awaits a rejecting call and return the thrown error.
const captureError = async (run: () => Promise<unknown>): Promise<any> => {
  try {
    await run();
  } catch (err) {
    return err;
  }
  throw new Error('expected the call to reject, but it resolved');
};

describe('survey-client / callSurvey', () => {
  afterEach(() => jest.restoreAllMocks());

  describe('success responses', () => {
    it('returns parsed JSON on a 200 GET', async () => {
      installFetch(makeResponse({ status: 200, body: { hello: 'world' } }));

      const data = await callSurvey(() =>
        openIndex({ ...surveyRequest(), path: { nodeOperatorId: 'csm-1' } }),
      );

      expect(data).toEqual({ hello: 'world' });
    });

    it('resolves to undefined on a 204 response', async () => {
      installFetch(makeResponse({ status: 204, body: undefined }));

      const data = await callSurvey(() =>
        contactsDeleteOne({
          ...surveyRequest('Bearer tok'),
          path: { nodeOperatorId: 'csm-1' },
        }),
      );

      expect(data).toBeUndefined();
    });

    it('resolves to undefined when Content-Length is 0', async () => {
      installFetch(
        makeResponse({
          status: 200,
          body: undefined,
          headers: { 'content-length': '0' },
        }),
      );

      const data = await callSurvey(() =>
        contactsDeleteOne({
          ...surveyRequest('Bearer tok'),
          path: { nodeOperatorId: 'csm-1' },
        }),
      );

      expect(data).toBeUndefined();
    });
  });

  describe('headers', () => {
    it('sends a verbatim bearer Authorization header when a token is passed', async () => {
      const fetchMock = installFetch(
        makeResponse({ status: 200, body: { ok: true } }),
      );

      await callSurvey(() =>
        contactsFindOne({
          ...surveyRequest('Bearer xyz'),
          path: { nodeOperatorId: 'csm-1' },
        }),
      );

      // Verbatim — NOT re-prefixed by the SDK bearer-security mechanism.
      expect(lastRequest(fetchMock).headers.get('Authorization')).toBe(
        'Bearer xyz',
      );
    });

    it('sends Content-Type application/json on a body-bearing POST', async () => {
      const fetchMock = installFetch(
        makeResponse({ status: 200, body: { ok: true } }),
      );

      await callSurvey(() =>
        contactsUpdate({
          ...surveyRequest('Bearer tok'),
          path: { nodeOperatorId: 'csm-1' },
          body: { name: 'op' },
        }),
      );

      // client-fetch strips Content-Type on bodiless requests (more correct
      // than the old transport, which always sent it); it is present here
      // because the POST carries a JSON body.
      expect(lastRequest(fetchMock).headers.get('Content-Type')).toBe(
        'application/json',
      );
    });

    it('omits the Authorization header when no token is passed', async () => {
      const fetchMock = installFetch(
        makeResponse({ status: 200, body: { ok: true } }),
      );

      await callSurvey(() =>
        openIndex({ ...surveyRequest(), path: { nodeOperatorId: 'csm-1' } }),
      );

      const req = lastRequest(fetchMock);
      expect(req.headers.get('Authorization')).toBeNull();
    });
  });

  describe('url construction', () => {
    it('joins base URL with the templated path', async () => {
      const fetchMock = installFetch(
        makeResponse({ status: 200, body: { ok: true } }),
      );

      await callSurvey(() =>
        openIndex({ ...surveyRequest(), path: { nodeOperatorId: 'csm-1' } }),
      );

      expect(lastRequest(fetchMock).url).toBe(
        'https://surveys.test/open/csm-1',
      );
    });

    it('appends query params and drops undefined values', () => {
      // No survey endpoint types a query, so prove the configured client's URL
      // builder matches the old appendQuery behavior directly: base+path join,
      // query serialized, undefined dropped. The runtime forwards any `query`
      // it receives to this same builder.
      const url = surveyClient.buildUrl({
        url: '/open/{nodeOperatorId}',
        path: { nodeOperatorId: 'csm-1' },
        query: { foo: 'bar', skip: undefined },
      });

      expect(url).toBe('https://surveys.test/open/csm-1?foo=bar');
    });
  });

  describe('error mapping', () => {
    it('throws a SurveysApiError carrying status, url, body, code, details', async () => {
      const envelope = {
        code: 'VALIDATION_FAILED',
        message: 'Validation failed',
        details: [{ field: 'name', message: 'required' }],
      };
      installFetch(
        makeResponse(
          { status: 400, body: envelope },
          'https://surveys.test/csm-1/contacts',
        ),
      );

      const err = await captureError(() =>
        callSurvey(() =>
          contactsFindOne({
            ...surveyRequest('Bearer tok'),
            path: { nodeOperatorId: 'csm-1' },
          }),
        ),
      );

      expect(err).toBeInstanceOf(SurveysApiError);
      expect(err.status).toBe(400);
      expect(err.url).toBe('https://surveys.test/csm-1/contacts');
      expect(err.body).toEqual(envelope);
      expect(err.code).toBe('VALIDATION_FAILED');
      expect(err.details).toEqual([
        { field: 'name', message: 'required', code: undefined },
      ]);
    });

    it('uses the envelope message as the error message', async () => {
      installFetch(
        makeResponse({
          status: 500,
          body: { code: 'INTERNAL', message: 'boom' },
        }),
      );

      const err = await captureError(() =>
        callSurvey(() =>
          openIndex({ ...surveyRequest(), path: { nodeOperatorId: 'csm-1' } }),
        ),
      );

      expect(err).toBeInstanceOf(SurveysApiError);
      expect(err.message).toBe('boom');
    });

    it('carries everything authErrorKind needs (codeless 401 -> logout)', async () => {
      installFetch(makeResponse({ status: 401, body: { message: 'nope' } }));

      const err = await captureError(() =>
        callSurvey(() =>
          contactsFindOne({
            ...surveyRequest('Bearer tok'),
            path: { nodeOperatorId: 'csm-1' },
          }),
        ),
      );

      expect(err).toBeInstanceOf(SurveysApiError);
      // T5 will call authErrorKind on the thrown error to drive onAuthError.
      expect(authErrorKind(err)).toBe('logout');
    });

    it('classifies AUTH_JWT_EXPIRED as reauth via the thrown error', async () => {
      installFetch(
        makeResponse({
          status: 401,
          body: { code: 'AUTH_JWT_EXPIRED', message: 'expired' },
        }),
      );

      const err = await captureError(() =>
        callSurvey(() =>
          contactsFindOne({
            ...surveyRequest('Bearer tok'),
            path: { nodeOperatorId: 'csm-1' },
          }),
        ),
      );

      expect(authErrorKind(err)).toBe('reauth');
    });

    it('does not classify a domain 403 as an auth error', async () => {
      installFetch(
        makeResponse({
          status: 403,
          body: {
            code: 'OPERATOR_ACCESS_DENIED',
            message: 'You are not allowed to access this operator',
          },
        }),
      );

      const err = await captureError(() =>
        callSurvey(() =>
          contactsFindOne({
            ...surveyRequest('Bearer tok'),
            path: { nodeOperatorId: 'csm-1' },
          }),
        ),
      );

      expect(err).toBeInstanceOf(SurveysApiError);
      expect(authErrorKind(err)).toBeUndefined();
    });
  });
});
