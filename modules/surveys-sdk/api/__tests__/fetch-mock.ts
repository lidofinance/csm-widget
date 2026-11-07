import type { Mock } from 'vitest';

type FetchResponseInit = {
  status: number;
  body?: unknown;
  /** Raw header map; `content-type` defaults to application/json. */
  headers?: Record<string, string>;
};

// Minimal Response-like the bundled client-fetch runtime consumes:
// .ok/.status/.url/.headers.get/.text/.json
export const makeResponse = (
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
    text: vi.fn().mockResolvedValue(text),
    json: vi.fn().mockResolvedValue(init.body),
  } as unknown as Response;
};

export const installFetch = (response: Response): Mock => {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

// The client builds a `Request`; pull the resolved URL/headers off it.
export const lastRequest = (fetchMock: Mock): Request =>
  fetchMock.mock.calls[fetchMock.mock.calls.length - 1][0] as Request;
