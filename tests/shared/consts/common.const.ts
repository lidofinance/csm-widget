export enum TokenSymbol {
  WSTETH = 'WSTETH',
  STETH = 'STETH',
  ETH = 'ETH',
}

// TokenSelector option testids carry the SDK token value, not this enum
export const BOND_TOKEN_OPTION_TEST_ID: Record<TokenSymbol, string> = {
  [TokenSymbol.ETH]: 'tokenOption-ETH',
  [TokenSymbol.STETH]: 'tokenOption-stETH',
  [TokenSymbol.WSTETH]: 'tokenOption-wstETH',
};

export const FIRST_BOND = 2.4;
export const EXTRA_PER_KEY = 1.3;

export enum Tags {
  smoke = '@smoke',
  matomo = '@matomo',
  noProd = '@noProd',
  noStaging = '@noStaging',
  noTestnet = '@noTestnet',
  noPreview = '@noPreview',
}
