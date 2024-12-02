import { URL, URLSearchParams } from 'url';

export type FetchApi = (
  url: string,
  params?: Record<string, string | readonly string[] | undefined>,
  init?: RequestInit,
) => Promise<Response>;

export const fetchApi: FetchApi = (url, params, init) => {
  const _url = new URL(url);
  if (params) {
    for (const param in params) {
      /* You can get copy by spreading {...query} */
      if (
        params[param] === undefined ||
        params[param] === null ||
        params[param] === ''
      ) {
        delete params[param];
      }
    }
    _url.search = new URLSearchParams(
      params as any as URLSearchParams,
    ).toString();
  }
  return fetch(_url.toString(), {
    ...init,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  });
};
