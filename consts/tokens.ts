import { TOKENS as TOKENS_SDK } from '@lido-sdk/constants';
import { parseEther } from 'viem';

export const TOKENS = {
  ETH: 'ETH',
  [TOKENS_SDK.STETH]: TOKENS_SDK.STETH,
  [TOKENS_SDK.WSTETH]: TOKENS_SDK.WSTETH,
} as const;

export type TOKENS = keyof typeof TOKENS;

// one eth
export const ONE_ETH = parseEther('1');

// max 1000 eth to claim (unstETH);
export const MAX_ETH_AMOUNT = parseEther('1000');

// min 100 wei to claim (unstETH);
export const MIN_ETH_AMOUNT = 100n;
