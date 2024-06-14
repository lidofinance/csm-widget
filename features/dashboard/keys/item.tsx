import { FC } from 'react';
import { CountStyled, ItemStyled } from './styles';

export const Item: FC<{ title: string; count?: number | string }> = ({
  title,
  count,
}) => (
  <ItemStyled>
    <CountStyled>{count}</CountStyled>
    {title}
  </ItemStyled>
);
