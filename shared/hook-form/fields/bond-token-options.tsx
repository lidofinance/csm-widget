import {
  isTokenIcon,
  TokenIcon,
  TokenSelectorOption,
} from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { formatBalance } from 'utils/format-balance';
import { getTokenDisplayName } from 'utils/get-token-display-name';
import { pluralKeys } from 'utils/plural';

export type BondTokenOptionsInput = {
  ethBalance?: bigint;
  stethBalance?: bigint;
  wstethBalance?: bigint;
  keysAvailable?: Partial<Record<TOKENS, { count: number }>>;
};

export const getTokenOptionTestId = (token: string) => `tokenOption-${token}`;

/** Bond token options: balance as the label, key capacity as the secondary label when known. */
export const getBondTokenOptions = ({
  ethBalance,
  stethBalance,
  wstethBalance,
  keysAvailable,
}: BondTokenOptionsInput): TokenSelectorOption[] =>
  (
    [
      [TOKENS.eth, ethBalance],
      [TOKENS.steth, stethBalance],
      [TOKENS.wsteth, wstethBalance],
    ] as const
  ).map(([token, balance]) => {
    const keysCount = keysAvailable?.[token]?.count;

    return {
      value: token,
      icon: isTokenIcon(token) ? <TokenIcon token={token} /> : undefined,
      label: `${formatBalance(balance).trimmed} ${getTokenDisplayName(token)}`,
      secondaryLabel:
        keysCount === undefined
          ? undefined
          : pluralKeys({ value: keysCount, showValue: true }),
      dataTestId: { root: getTokenOptionTestId(token) },
    };
  });
