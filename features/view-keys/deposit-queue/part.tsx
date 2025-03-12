import { FC } from 'react';
import { useHover } from './hover-provider';
import { GraphPart } from './types';
import { PartStyle } from './style';

type PartProps = {
  type: GraphPart;
  size?: number;
  offset?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export const Part: FC<PartProps> = ({ type, size, offset, ...props }) => {
  const { hover } = useHover();

  return (
    <PartStyle
      $type={type}
      $size={size}
      $offset={offset}
      $fade={hover && hover !== type}
      {...props}
    />
  );
};
