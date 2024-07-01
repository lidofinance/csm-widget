import { FC } from 'react';
import { CountStyled, ItemStyled } from './styles';
import { Tooltip } from '@lidofinance/lido-ui';

type ItemProps = { title: string; count?: number | string; tooltip?: string };

export const Item: FC<ItemProps> = ({ title, tooltip, count }) => {
  const body = (
    <ItemStyled>
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
