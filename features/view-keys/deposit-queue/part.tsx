import { Tooltip } from '@lidofinance/lido-app-ui';
import { CSSProperties, FC, useCallback } from 'react';
import { useGraphInteraction } from './hover-provider';
import { getPartStyle } from './part-style';
import s from './styles.module.css';
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
    <div
      className={s.part}
      data-type={type}
      data-fade={(hover && hover !== type) || undefined}
      style={getPartStyle(type, inner ? 100 : width, inner ? 0 : offset)}
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
        content={<Content metadata={metadata} unit={unit} />}
        position="top"
        style={wrapperStyle}
      >
        {renderPart(true)}
      </Tooltip>
    );
  }

  return renderPart();
};
