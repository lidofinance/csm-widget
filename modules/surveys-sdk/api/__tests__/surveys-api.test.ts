jest.mock('config', () => ({
  config: { surveysApiUrl: 'https://surveys.test' },
}));

jest.mock('consts/external-links', () => ({
  getExternalLinks: () => ({ surveyApi: 'https://default.test' }),
}));

import { FetcherError } from 'utils/fetcher-error';
import {
  isSurveysApiConfigured,
  SURVEYS_API_BASE_URL,
  surveysDelete,
  surveysGet,
  surveysGetNonce,
  surveysPost,
  surveysSignin,
} from '../surveys-api';
import { SurveysApiError, isAuthError } from '../errors';

const mockFetch = (status: number, body?: unknown): jest.Mock => {
  const json = jest.fn().mockResolvedValue(body ?? { ok: true });
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
    json,
  });
};

const lastFetchInit = (fetchMock: jest.Mock): RequestInit =>
  fetchMock.mock.calls[fetchMock.mock.calls.length - 1][1] as RequestInit;

const lastFetchUrl = (fetchMock: jest.Mock): string =>
  fetchMock.mock.calls[fetchMock.mock.calls.length - 1][0] as string;

describe('surveys-api', () => {
  beforeEach(() => {
    (global as unknown as { fetch: jest.Mock }).fetch = mockFetch(200, {
      hello: 'world',
    });
  });

  it('resolves base URL from config at module load', () => {
    expect(SURVEYS_API_BASE_URL).toBe('https://surveys.test');
    expect(isSurveysApiConfigured).toBe(true);
  });

  it('sets Authorization header when token is provided', async () => {
    const fetchMock = (global as unknown as { fetch: jest.Mock }).fetch;
    await surveysGet<unknown>('csm-1/contacts', { token: 'Bearer xyz' });

    const init = lastFetchInit(fetchMock);
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer xyz',
    );
  });

  it('omits Authorization header when no token', async () => {
    const fetchMock = (global as unknown as { fetch: jest.Mock }).fetch;
    await surveysGet<unknown>('open/csm-1');

    const init = lastFetchInit(fetchMock);
    expect(
      (init.headers as Record<string, string>).Authorization,
    ).toBeUndefined();
  });

  it('builds the full URL by joining base + path', async () => {
    const fetchMock = (global as unknown as { fetch: jest.Mock }).fetch;
    await surveysGet<unknown>('csm-1/contacts');

    expect(lastFetchUrl(fetchMock)).toBe('https://surveys.test/csm-1/contacts');
  });

  it('appends query params', async () => {
    const fetchMock = (global as unknown as { fetch: jest.Mock }).fetch;
    await surveysGet<unknown>('csm-1/contacts', {
      query: { foo: 'bar', skip: undefined },
    });

    expect(lastFetchUrl(fetchMock)).toBe(
      'https://surveys.test/csm-1/contacts?foo=bar',
    );
  });

  it('surveysPost sends a JSON-serialized body', async () => {
    const fetchMock = (global as unknown as { fetch: jest.Mock }).fetch;
    await surveysPost<unknown, { a: number }>('csm-1/x', { a: 1 });

    const init = lastFetchInit(fetchMock);
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it('surveysDelete issues a DELETE', async () => {
    const fetchMock = (global as unknown as { fetch: jest.Mock }).fetch;
    await surveysDelete('csm-1/x', { token: 'tok' });

    expect(lastFetchInit(fetchMock).method).toBe('DELETE');
  });

  it('surveysSignin posts to /auth/signin without a token', async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = mockFetch(200, {
      access_token: 'a',
      token_type: 'Bearer',
    });

    const res = await surveysSignin({ message: 'm', signature: 's' });
    expect(res.access_token).toBe('a');

    const fetchMock = (global as unknown as { fetch: jest.Mock }).fetch;
    expect(lastFetchUrl(fetchMock)).toBe('https://surveys.test/auth/signin');
    expect(
      (lastFetchInit(fetchMock).headers as Record<string, string>)
        .Authorization,
    ).toBeUndefined();
  });

  it('surveysGetNonce GETs /auth/nonce without a token', async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = mockFetch(200, {
      nonce: 'server-nonce',
    });

    const res = await surveysGetNonce();
    expect(res.nonce).toBe('server-nonce');

    const fetchMock = (global as unknown as { fetch: jest.Mock }).fetch;
    expect(lastFetchUrl(fetchMock)).toBe('https://surveys.test/auth/nonce');
    expect(lastFetchInit(fetchMock).method).toBe('GET');
    expect(
      (lastFetchInit(fetchMock).headers as Record<string, string>)
        .Authorization,
    ).toBeUndefined();
  });

  it('invokes onAuthError on 401 then throws SurveysApiError', async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = mockFetch(401, {
      message: 'unauthorized',
    });
    const onAuthError = jest.fn();

    await expect(
      surveysGet('me', { token: 'tok', onAuthError }),
    ).rejects.toBeInstanceOf(SurveysApiError);
    expect(onAuthError).toHaveBeenCalledTimes(1);
  });

  it('invokes onAuthError on 403', async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = mockFetch(403, {});
    const onAuthError = jest.fn();

    await expect(
      surveysGet('me', { token: 'tok', onAuthError }),
    ).rejects.toBeInstanceOf(SurveysApiError);
    expect(onAuthError).toHaveBeenCalledTimes(1);
  });

  it('does not invoke onAuthError on non-auth errors', async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = mockFetch(500, {});
    const onAuthError = jest.fn();

    await expect(
      surveysGet('me', { token: 'tok', onAuthError }),
    ).rejects.toBeInstanceOf(SurveysApiError);
    expect(onAuthError).not.toHaveBeenCalled();
  });

  it('does not invoke onAuthError on 401 for token-less request', async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = mockFetch(401, {});
    const onAuthError = jest.fn();

    await expect(surveysGet('open/x', { onAuthError })).rejects.toBeInstanceOf(
      SurveysApiError,
    );
    expect(onAuthError).not.toHaveBeenCalled();
  });
});

describe('isAuthError', () => {
  it('matches 401/403 on SurveysApiError', () => {
    expect(
      isAuthError(new SurveysApiError({ message: 'x', status: 401, url: 'u' })),
    ).toBe(true);
    expect(
      isAuthError(new SurveysApiError({ message: 'x', status: 403, url: 'u' })),
    ).toBe(true);
    expect(
      isAuthError(new SurveysApiError({ message: 'x', status: 500, url: 'u' })),
    ).toBe(false);
  });

  it('matches 401/403 on FetcherError too', () => {
    expect(isAuthError(new FetcherError('x', 401))).toBe(true);
    expect(isAuthError(new FetcherError('x', 500))).toBe(false);
  });

  it('returns false for non-errors', () => {
    expect(isAuthError(new Error('plain'))).toBe(false);
    expect(isAuthError(null)).toBe(false);
  });
});
