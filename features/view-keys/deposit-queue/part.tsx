import { FC, useCallback } from 'react';
import { useGraphInteraction } from './hover-provider';
import { GraphPart } from './types';
import { PartStyle } from './style';

type PartProps = {
  type: GraphPart;
  width?: number;
  offset?: number;
};

export const Part: FC<PartProps> = ({ type, width, offset }) => {
  const { hover, setFullView } = useGraphInteraction();

  const onMouseEnter = useCallback(() => {
    setFullView(true);
  }, [setFullView]);

  if (!width && type !== 'limit') {
    return null;
  }

  return (
    <PartStyle
      $type={type}
      $width={width}
      $offset={offset}
      $fade={hover && hover !== type}
      onMouseEnter={type === 'active' ? onMouseEnter : undefined}
    />
  );
};
