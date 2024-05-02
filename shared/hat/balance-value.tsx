import { InlineLoader } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import { FormatToken } from 'shared/formatters';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { BalanceIconStyle, BalanceRowStyle, BalanceValueStyle } from './styles';

import { ReactComponent as EthIcon } from 'assets/icons/eth.svg';
import { ReactComponent as StethIcon } from 'assets/icons/steth.svg';
import { ReactComponent as WstethIcon } from 'assets/icons/wsteth.svg';

type BalanceValueProps = {
  token: TOKENS;
  loading?: boolean;
} & Omit<ComponentProps<typeof FormatToken>, 'symbol'>;

const iconsMap = {
  [TOKENS.ETH]: <EthIcon />,
  [TOKENS.STETH]: <StethIcon />,
  [TOKENS.WSTETH]: <WstethIcon />,
} as const;

export const BalanceRow: FC<PropsWithChildren> = (props) => (
  <BalanceRowStyle {...props} />
);

export const BalanceValue: FC<BalanceValueProps> = ({
  token,
  loading,
  ...props
}) => {
  const symbol = getTokenDisplayName(token);
  const icon = iconsMap[token];
  return (
    <BalanceValueStyle>
      {icon ? <BalanceIconStyle>{icon}</BalanceIconStyle> : undefined}
      {loading ? <InlineLoader /> : <FormatToken {...props} symbol={symbol} />}
    </BalanceValueStyle>
  );
};
