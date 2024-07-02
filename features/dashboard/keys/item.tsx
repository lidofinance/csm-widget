import { FC } from 'react';
import { CountStyled, ItemStyled } from './styles';
import { Tooltip } from '@lidofinance/lido-ui';

type ItemProps = {
  title: string;
  count?: number | string;
  tooltip?: string;
  dangerous?: boolean;
};

export const Item: FC<ItemProps> = ({ title, tooltip, count, dangerous }) => {
  const isSecondary = typeof count === 'string' || !count;

  const body = (
    <ItemStyled $secondary={isSecondary} $warning={dangerous}>
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
