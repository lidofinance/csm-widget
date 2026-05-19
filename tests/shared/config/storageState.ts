export const REFUSE_CF_BLOCK_COOKIE =
  process.env.REFUSE_CF_BLOCK_NAME && process.env.REFUSE_CF_BLOCK_VALUE
    ? [
        {
          name: process.env.REFUSE_CF_BLOCK_NAME,
          value: process.env.REFUSE_CF_BLOCK_VALUE,
          path: '/',
          domain: '.testnet.fi',
          expires: -1,
          httpOnly: false,
          secure: false,
        },
      ]
    : [];

export const storageState: any = {
  cookies: [...REFUSE_CF_BLOCK_COOKIE],
  origins: [],
};
