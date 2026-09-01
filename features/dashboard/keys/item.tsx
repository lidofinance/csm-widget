import { InlineLoader } from '@lidofinance/lido-ui';
import { Tooltip } from 'shared/components';
import { FC, ReactNode } from 'react';
import { BalanceStyled, CountStyled, ItemStyled } from './styles';

type ItemProps = {
  title: string;
  count?: number | string | ReactNode;
  balance?: ReactNode;
  tooltip?: string;
  variant?: 'secondary';
};

export const Item: FC<ItemProps> = ({
  title,
  tooltip,
  count,
  balance,
  variant,
  ...params
}) => {
  const isEmptyCount = !count || typeof count === 'string';
  const secondary = variant === 'secondary' || isEmptyCount;

  const body = (
    <ItemStyled $secondary={secondary} {...params}>
      {title}
      <CountStyled>
        {count === undefined ? <InlineLoader /> : count}
      </CountStyled>
      {balance !== undefined && <BalanceStyled>{balance}</BalanceStyled>}
    </ItemStyled>
  );

  if (tooltip) {
    return (
      <Tooltip placement="top" title={tooltip}>
        {body}
      </Tooltip>
    );
  }
  return body;
};
