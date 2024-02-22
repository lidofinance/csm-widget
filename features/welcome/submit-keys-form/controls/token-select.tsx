import {
  TOKENS,
  TokenOption,
  TokenSelectHookForm,
} from 'shared/hook-form/controls/token-select-hook-form';

const OPTIONS: TokenOption[] = [
  { token: TOKENS.ETH },
  { token: TOKENS.STETH },
  { token: TOKENS.WSTETH },
];

export const TokenSelect = () => {
  return <TokenSelectHookForm options={OPTIONS} />;
};
