import { isValidEns, resolveEnsAddress } from './ens';

const ADDRESS = '0x1111111111111111111111111111111111111111';

const makeClient = (impl?: () => Promise<string | null>) => ({
  getEnsAddress: jest.fn(impl ?? (async () => ADDRESS)),
});

describe('isValidEns', () => {
  it.each(['lido.eth', 'Lido.eth', 'LIDO.ETH', 'sub.lido.eth'])(
    'accepts %s',
    (name) => {
      expect(isValidEns(name)).toBe(true);
    },
  );

  it.each(['lido', 'lido.com', ADDRESS, ''])('rejects "%s"', (value) => {
    expect(isValidEns(value)).toBe(false);
  });
});

describe('resolveEnsAddress', () => {
  it.each([
    ['Lido.eth', 'lido.eth'],
    ['LIDO.ETH', 'lido.eth'],
    ['lido.eth', 'lido.eth'],
  ])('queries %s as %s', async (input, normalized) => {
    const client = makeClient();
    await resolveEnsAddress(client as never, input);
    expect(client.getEnsAddress).toHaveBeenCalledWith({ name: normalized });
  });

  it('returns the client address', async () => {
    const client = makeClient();
    expect(await resolveEnsAddress(client as never, 'lido.eth')).toBe(ADDRESS);
  });

  it.each(['a@b.eth', 'li_do.eth'])(
    'returns undefined without querying for non-normalizable %s',
    async (name) => {
      const client = makeClient();
      expect(await resolveEnsAddress(client as never, name)).toBeUndefined();
      expect(client.getEnsAddress).not.toHaveBeenCalled();
    },
  );

  it('returns undefined when the client rejects', async () => {
    const client = makeClient(async () => {
      throw new Error('rpc');
    });
    expect(
      await resolveEnsAddress(client as never, 'lido.eth'),
    ).toBeUndefined();
  });

  it('returns undefined when the client returns null', async () => {
    const client = makeClient(async () => null);
    expect(
      await resolveEnsAddress(client as never, 'lido.eth'),
    ).toBeUndefined();
  });

  it('returns undefined without a client', async () => {
    expect(await resolveEnsAddress(undefined, 'lido.eth')).toBeUndefined();
  });
});
