import { InlineLoader, Tooltip } from '@lidofinance/lido-ui';
import { DATA_UNAVAILABLE } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
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

const iconsMap = {
  [TOKENS.ETH]: <EthIcon />,
  [TOKENS.STETH]: <StethIcon />,
  [TOKENS.WSTETH]: <WstethIcon />,
} as const;

type TokenAmountProps = {
  token: TOKENS;
  amount?: BigNumber;
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
    <TokenAmountStyle data-testid="tokenAmount">
      {icon}
      {loading ? (
        <InlineLoader color="text" />
      ) : !amount ? (
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
