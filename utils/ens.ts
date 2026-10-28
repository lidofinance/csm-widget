import type { PublicClient } from 'viem';

const ENS_REGEX = /^[-a-zA-Z0-9@._]{1,256}\.eth$/i;

export const isValidEns = (value: string) => ENS_REGEX.test(value);

export const resolveEnsAddress = async (
  client: Pick<PublicClient, 'getEnsAddress'> | undefined,
  name: string,
): Promise<string | undefined> => {
  // viem doesn't normalize: a raw name hashes to a different, registrable node.
  // Lazy: ENSIP-15 tables are heavy and only needed once an ENS name is typed
  return (
    (await import('viem/ens')
      .then(({ normalize }) => client?.getEnsAddress({ name: normalize(name) }))
      .catch(() => null)) ?? undefined
  );
};
