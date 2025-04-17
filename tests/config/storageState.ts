//works only for testnet.
export const REFUSE_CF_BLOCK_COOKIE = [
  {
    name: process.env.REFUSE_CF_BLOCK_NAME || '',
    value: process.env.REFUSE_CF_BLOCK_VALUE || '',
    path: '/',
    domain: '.testnet.fi',
    expires: -1,
    httpOnly: false,
    secure: false,
    sameSite: 'Strict',
  },
];

export const storageState: any = {
  cookies: [...REFUSE_CF_BLOCK_COOKIE],
  origins: [],
};
