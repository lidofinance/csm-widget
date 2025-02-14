import { FC } from 'react';
import { useHover } from './hover-provider';
import { GraphPart } from './types';
import { PartStyle } from './style';

type PartProps = {
  type: GraphPart;
  size?: number;
  offset?: number;
};

export const Part: FC<PartProps> = ({ type, size, offset }) => {
  const { hover } = useHover();

  return (
    <PartStyle
      $type={type}
      $size={size}
      $offset={offset}
      $fade={hover && hover !== type}
    />
  );
};
