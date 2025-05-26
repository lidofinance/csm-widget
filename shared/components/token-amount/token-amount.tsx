import { InlineLoader, Tooltip } from '@lidofinance/lido-ui';
import { DATA_UNAVAILABLE } from 'consts/text';
import { FC } from 'react';
import {
  FormatBalanceArgs,
  getTokenDisplayName,
  useFormattedBalance,
} from 'utils';
import { SymbolStyle, TokenAmountStyle } from './style';

import { ReactComponent as EthIcon } from 'assets/icons/eth.svg';
import { ReactComponent as StethIcon } from 'assets/icons/steth.svg';
import { ReactComponent as WstethIcon } from 'assets/icons/wsteth.svg';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

const iconsMap = {
  [TOKENS.eth]: <EthIcon />,
  [TOKENS.steth]: <StethIcon />,
  [TOKENS.wsteth]: <WstethIcon />,
} as const;

type TokenAmountProps = {
  token: TOKENS;
  amount?: bigint;
  loading?: boolean;
  fallback?: string;
} & FormatBalanceArgs;

// TODO: merge components
export const TokenAmount: FC<TokenAmountProps> = ({
  token,
  loading,
  amount,
  maxDecimalDigits = 4,
  maxTotalLength = 7,
  adaptiveDecimals,
  fallback = DATA_UNAVAILABLE,
}) => {
  const { actual, trimmed } = useFormattedBalance(amount, {
    maxDecimalDigits,
    maxTotalLength,
    adaptiveDecimals,
  });

  const icon = iconsMap[token];
  const symbol = getTokenDisplayName(token);

  return (
    <TokenAmountStyle>
      {icon}
      {loading ? (
        <InlineLoader color="text" />
      ) : amount === undefined ? (
        <SymbolStyle>{fallback}</SymbolStyle>
      ) : (
        <span>
          <Tooltip
            placement="topRight"
            title={
              <span>
                {actual}&nbsp;{symbol}
              </span>
            }
          >
            <>
              {trimmed}&nbsp;<SymbolStyle>{symbol}</SymbolStyle>
            </>
          </Tooltip>
        </span>
      )}
    </TokenAmountStyle>
  );
};
