import { CL_POST_MAX_IDS } from '@lidofinance/lido-csm-sdk';
import type { NextApiRequest } from 'next';

import { parseClValidatorsRequest } from './cl-validators-request';
import { InvalidRequestError } from './errors';

const pubkey = (n: number) => `0x${n.toString(16).padStart(96, '0')}`;
const ones = (length: number) => Array.from({ length }, () => '1');
const get = (query: Record<string, unknown>) =>
  ({ method: 'GET', query }) as unknown as NextApiRequest;
const post = (body: unknown, query: Record<string, unknown> = {}) =>
  ({ method: 'POST', body, query }) as unknown as NextApiRequest;

describe('parseClValidatorsRequest GET', () => {
  it.each([
    ['no id', {}],
    ['empty id', { id: '' }],
    ['array id', { id: [pubkey(1)] }],
    ['empty entry', { id: `${pubkey(1)},` }],
    ['bad id', { id: 'foo' }],
    ['short pubkey', { id: '0x1234' }],
    [
      'too many ids',
      {
        id: ones(CL_POST_MAX_IDS + 1).join(','),
      },
    ],
  ])('rejects %s', (_name, query) => {
    expect(() => parseClValidatorsRequest(get(query))).toThrow(
      InvalidRequestError,
    );
  });

  it('accepts pubkeys and indices, drops other params', () => {
    const id = `${pubkey(1)},42`;
    expect(
      parseClValidatorsRequest(
        get({ id, status: 'active', foo: 'bar', method: ['1'] }),
      ),
    ).toEqual({ params: { id, status: 'active' } });
  });

  it('accepts max ids', () => {
    const id = ones(CL_POST_MAX_IDS).join(',');
    expect(parseClValidatorsRequest(get({ id })).params).toEqual({ id });
  });
});

describe('parseClValidatorsRequest POST', () => {
  it.each([
    ['empty object', {}],
    ['no body', undefined],
    ['array body', [pubkey(1)]],
    ['empty ids', { ids: [] }],
    ['non-array ids', { ids: pubkey(1) }],
    ['too many ids', { ids: ones(CL_POST_MAX_IDS + 1) }],
    ['bad id', { ids: [pubkey(1), 'nope'] }],
    ['non-string id', { ids: [1] }],
    ['bad statuses', { ids: ['1'], statuses: [1] }],
    ['invalid json string', '{'],
  ])('rejects %s', (_name, body) => {
    expect(() => parseClValidatorsRequest(post(body))).toThrow(
      InvalidRequestError,
    );
  });

  it('accepts object body and drops extra fields and query params', () => {
    const result = parseClValidatorsRequest(
      post({ ids: [pubkey(1), '7'], extra: 1 }, { id: '1' }),
    );
    expect(result.params).toEqual({});
    expect(JSON.parse(result.body as string)).toEqual({
      ids: [pubkey(1), '7'],
    });
  });

  it('accepts string and Buffer bodies with statuses', () => {
    const raw = JSON.stringify({ ids: ['1'], statuses: ['active_ongoing'] });
    const expected = { ids: ['1'], statuses: ['active_ongoing'] };
    expect(
      JSON.parse(parseClValidatorsRequest(post(raw)).body as string),
    ).toEqual(expected);
    expect(
      JSON.parse(
        parseClValidatorsRequest(post(Buffer.from(raw))).body as string,
      ),
    ).toEqual(expected);
  });
});
