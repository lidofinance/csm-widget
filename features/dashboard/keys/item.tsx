import { InlineLoader, Tooltip } from '@lidofinance/lido-ui';
import { FC, ReactNode } from 'react';
import { CountStyled, ItemStyled } from './styles';

type ItemProps = {
  title: string;
  count?: number | string | ReactNode;
  tooltip?: string;
  variant?: 'secondary';
};

export const Item: FC<ItemProps> = ({
  title,
  tooltip,
  count,
  variant,
  ...params
}) => {
  const isEmptyCount = !count || typeof count === 'string';
  const secondary = variant === 'secondary' || isEmptyCount;

  const body = (
    <ItemStyled $secondary={secondary} {...params}>
      <CountStyled>
        {count === undefined ? <InlineLoader /> : count}
      </CountStyled>
      {title}
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
