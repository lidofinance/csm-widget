import { FC } from 'react';
import { DecorLeftStyle, DecorRightStyle, DecorWrapper } from './styles';

export const Decor: FC = () => (
  <DecorWrapper>
    <DecorLeftStyle />
    <DecorRightStyle />
  </DecorWrapper>
);
