import { TOKENS as TOKENS_SDK } from '@lido-sdk/constants';

export const TOKENS = {
  ETH: 'ETH',
  [TOKENS_SDK.STETH]: TOKENS_SDK.STETH,
  [TOKENS_SDK.WSTETH]: TOKENS_SDK.WSTETH,
} as const;
export type TOKENS = keyof typeof TOKENS;
