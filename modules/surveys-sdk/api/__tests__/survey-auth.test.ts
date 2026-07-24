// Tests for the public SIWE auth endpoints (api/survey-auth.ts). They route
// through the generated SDK + configured survey client (covered transport-wise
// by survey-client.test.ts); here we prove they hit the right URLs without a
// token and return the (non-undefined) parsed body.
//
// Same config/external-links mocks as the other surveys-sdk tests so
// SURVEYS_API_BASE_URL resolves to https://surveys.test.

jest.mock('config', () => ({
  config: { surveysApiUrl: 'https://surveys.test' },
}));

jest.mock('consts/external-links', () => ({
  getExternalLinks: () => ({ surveyApi: 'https://default.test' }),
}));

import { surveysGetNonce, surveysSignin } from '../survey-auth';

type FetchResponseInit = {
  status: number;
  body?: unknown;
};

// Minimal Response-like the client-fetch runtime understands (see
// survey-client.test.ts for the full rationale).
const makeResponse = (
  init: FetchResponseInit,
  url = 'https://surveys.test/x',
): Response => {
  const headers = new Headers({ 'content-type': 'application/json' });
  const text = init.body === undefined ? '' : JSON.stringify(init.body);
  return {
    ok: init.status >= 200 && init.status < 300,
    status: init.status,
    url,
    headers,
    text: jest.fn().mockResolvedValue(text),
    json: jest.fn().mockResolvedValue(init.body),
  } as unknown as Response;
};

const installFetch = (response: Response): jest.Mock => {
  const fetchMock = jest.fn().mockResolvedValue(response);
  (globalThis as unknown as { fetch: jest.Mock }).fetch = fetchMock;
  return fetchMock;
};

const lastRequest = (fetchMock: jest.Mock): Request =>
  fetchMock.mock.calls[fetchMock.mock.calls.length - 1][0] as Request;

describe('survey-auth', () => {
  afterEach(() => jest.restoreAllMocks());

  it('surveysGetNonce GETs /auth/nonce without a token', async () => {
    const fetchMock = installFetch(
      makeResponse(
        { status: 200, body: { nonce: 'server-nonce' } },
        'https://surveys.test/auth/nonce',
      ),
    );

    const res = await surveysGetNonce();
    expect(res.nonce).toBe('server-nonce');

    const req = lastRequest(fetchMock);
    expect(req.url).toBe('https://surveys.test/auth/nonce');
    expect(req.method).toBe('GET');
    expect(req.headers.get('Authorization')).toBeNull();
  });

  it('surveysSignin posts to /auth/signin without a token', async () => {
    const fetchMock = installFetch(
      makeResponse(
        { status: 200, body: { access_token: 'a', token_type: 'Bearer' } },
        'https://surveys.test/auth/signin',
      ),
    );

    const res = await surveysSignin({ message: 'm', signature: 's' });
    expect(res.access_token).toBe('a');

    const req = lastRequest(fetchMock);
    expect(req.url).toBe('https://surveys.test/auth/signin');
    expect(req.method).toBe('POST');
    expect(req.headers.get('Authorization')).toBeNull();
  });
});
