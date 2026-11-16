// Tests for the public SIWE auth endpoints (api/survey-auth.ts). They route
// through the generated SDK + configured survey client (covered transport-wise
// by survey-client.test.ts); here we prove they hit the right URLs without a
// token and return the (non-undefined) parsed body.
//
// The config mock makes SURVEYS_API_BASE_URL resolve to https://surveys.test.

vi.mock('config', () => ({
  config: { surveysApiUrl: 'https://surveys.test' },
}));

import { surveysGetNonce, surveysSignin } from '../survey-auth';
import { installFetch, lastRequest, makeResponse } from './fetch-mock';

describe('survey-auth', () => {
  afterEach(() => vi.restoreAllMocks());

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
