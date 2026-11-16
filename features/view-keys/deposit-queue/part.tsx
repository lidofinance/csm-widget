import { Tooltip } from 'shared/components';
import { CSSProperties, FC, useCallback } from 'react';
import { useGraphInteraction } from './hover-provider';
import { PartStyle } from './style';
import { BatchMetadata, GraphPart, QueueUnit } from './types';
import { BatchTooltipContent } from './batch-tooltip-content';
import { AddedTooltipContent } from './added-tooltip-content';

type PartProps = {
  type: GraphPart;
  width?: number;
  offset?: number;
  metadata?: BatchMetadata;
  unit: QueueUnit;
};

export const Part: FC<PartProps> = ({
  type,
  width,
  offset,
  metadata,
  unit,
}) => {
  const { hover, setFullView } = useGraphInteraction();

  const onMouseEnter = useCallback(() => {
    setFullView(true);
  }, [setFullView]);

  if (!width && type !== 'limit') {
    return null;
  }

  const renderPart = (inner?: boolean) => (
    <PartStyle
      $type={type}
      $width={inner ? 100 : width}
      $offset={inner ? 0 : offset}
      $fade={hover && hover !== type}
      onMouseEnter={type === 'active' ? onMouseEnter : undefined}
    />
  );

  // The Tooltip trigger span sizes the segment, so it takes over width/offset
  const wrapperStyle: CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'top',
    height: '100%',
    width: `${width}%`,
    ...(type === 'batch' && {
      position: 'absolute',
      left: `${offset}%`,
    }),
  };

  if ((type === 'batch' || type === 'added') && metadata) {
    const Content =
      type === 'batch' ? BatchTooltipContent : AddedTooltipContent;
    return (
      <Tooltip
        title={<Content metadata={metadata} unit={unit} />}
        placement="top"
        style={wrapperStyle}
      >
        {renderPart(true)}
      </Tooltip>
    );
  }

  return renderPart();
};
