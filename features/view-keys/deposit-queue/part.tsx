import { Tooltip } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { useGraphInteraction } from './hover-provider';
import { PartStyle } from './style';
import { BatchMetadata, GraphPart } from './types';
import { BatchTooltipContent } from './batch-tooltip-content';
import { AddedTooltipContent } from './added-tooltip-content';

type PartProps = {
  type: GraphPart;
  width?: number;
  offset?: number;
  metadata?: BatchMetadata;
};

export const Part: FC<PartProps> = ({ type, width, offset, metadata }) => {
  const { hover, setFullView } = useGraphInteraction();

  const onMouseEnter = useCallback(() => {
    setFullView(true);
  }, [setFullView]);

  if (!width && type !== 'limit') {
    return null;
  }

  const part = (
    <PartStyle
      $type={type}
      $width={width}
      $offset={offset}
      $fade={hover && hover !== type}
      onMouseEnter={type === 'active' ? onMouseEnter : undefined}
    />
  );

  if (type === 'batch' && metadata) {
    return (
      <Tooltip
        title={<BatchTooltipContent metadata={metadata} />}
        placement="top"
      >
        {part}
      </Tooltip>
    );
  }

  if (type === 'added' && metadata) {
    return (
      <Tooltip
        title={<AddedTooltipContent metadata={metadata} />}
        placement="top"
      >
        {part}
      </Tooltip>
    );
  }

  return part;
};
