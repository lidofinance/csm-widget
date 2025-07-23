import { PerToken, TOKENS } from '@lidofinance/lido-csm-sdk';

export const TOKEN_DISPLAY_NAMES: PerToken<string> = {
  [TOKENS.eth]: 'ETH',
  [TOKENS.steth]: 'stETH',
  [TOKENS.wsteth]: 'wstETH',
};

export const getTokenDisplayName = (token: TOKENS) =>
  TOKEN_DISPLAY_NAMES[token];

export const getTokenBalance = (
  balances: Partial<PerToken<bigint>>,
  token: TOKENS,
) => balances[token];
