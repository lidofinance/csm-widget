import { InlineLoader } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC, PropsWithChildren } from 'react';
import { FormatToken } from 'shared/formatters';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { BalanceRowStyle, BalanceValueStyle } from './styles';

import { ReactComponent as EthIcon } from 'assets/icons/eth.svg';
import { ReactComponent as StethIcon } from 'assets/icons/steth.svg';
import { ReactComponent as WstethIcon } from 'assets/icons/wsteth.svg';

type BalanceValueProps = {
  amount?: BigNumber;
  token: TOKENS;
  loading?: boolean;
};

const iconsMap = {
  [TOKENS.ETH]: <EthIcon />,
  [TOKENS.STETH]: <StethIcon />,
  [TOKENS.WSTETH]: <WstethIcon />,
} as const;

export const BalanceRow: FC<PropsWithChildren> = (props) => (
  <BalanceRowStyle {...props} />
);

export const BalanceValue: FC<BalanceValueProps> = ({
  amount,
  token,
  loading,
}) => {
  const symbol = getTokenDisplayName(token);
  const icon = iconsMap[token];
  return (
    <BalanceValueStyle>
      {icon}
      {loading ? (
        <InlineLoader />
      ) : (
        <FormatToken amount={amount} symbol={symbol} />
      )}
    </BalanceValueStyle>
  );
};
