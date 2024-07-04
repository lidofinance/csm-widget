import { FC } from 'react';
import { CountStyled, ItemStyled } from './styles';
import { Tooltip } from '@lidofinance/lido-ui';

type ItemProps = {
  title: string;
  count?: number | string;
  tooltip?: string;
  variant?: 'warning' | 'secondary';
};

export const Item: FC<ItemProps> = ({ title, tooltip, count, variant }) => {
  const body = (
    <ItemStyled
      $secondary={variant === 'secondary'}
      $warning={variant === 'warning'}
    >
      <CountStyled>{count}</CountStyled>
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
