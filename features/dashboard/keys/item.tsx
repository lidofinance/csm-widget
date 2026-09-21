import { InlineLoader } from '@lidofinance/lido-ui';
import { Tooltip } from 'shared/components';
import { FC, ReactNode } from 'react';
import { BalanceStyled, CountStyled, HeadStyled, ItemStyled } from './styles';

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

  const head = (
    <HeadStyled>
      {title}
      <CountStyled>
        {count === undefined ? <InlineLoader /> : count}
      </CountStyled>
    </HeadStyled>
  );

  return (
    <ItemStyled $secondary={secondary} {...params}>
      {tooltip ? (
        <Tooltip placement="top" title={tooltip}>
          {head}
        </Tooltip>
      ) : (
        head
      )}
      {balance !== undefined && <BalanceStyled>{balance}</BalanceStyled>}
    </ItemStyled>
  );
};
