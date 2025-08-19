import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { useGraphInteraction } from './hover-provider';
import { ChipStyle, CircleStyle, LegendStyle, PartStyle } from './style';
import { GraphPart } from './types';

const getTitle = (type: GraphPart) => {
  switch (type) {
    case 'active':
      return 'Active keys';
    case 'batch':
      return 'Your queued keys';
    case 'added':
      return 'Keys you’re trying to submit';
    case 'limit':
      return 'CSM stake limit';
    case 'queue':
      return 'Queued keys';
    case 'queueOverLimit':
      return 'Queued keys (over limit)';
    case 'priority0':
      return 'Priority queue';
    case 'priority1':
      return 'Priority 2 queue';
    case 'priority2':
      return 'Priority 3 queue';
    case 'priority3':
      return 'Priority 4 queue';
    case 'priority4':
      return 'Legacy queue';
    case 'priority5':
      return 'General queue';
    case 'priority0OverLimit':
      return 'Priority queue (over limit)';
    case 'priority1OverLimit':
      return 'Priority 2 queue (over limit)';
    case 'priority2OverLimit':
      return 'Priority 3 queue (over limit)';
    case 'priority3OverLimit':
      return 'Priority 4 queue (over limit)';
    case 'priority4OverLimit':
      return 'Legacy queue (over limit)';
    case 'priority5OverLimit':
      return 'General queue (over limit)';
  }
};

type LegendProps = {
  type: GraphPart;
  keysCount?: number | bigint;
  hide?: boolean;
};

export const Legend: FC<LegendProps> = ({ type, keysCount, hide = false }) => {
  const { setHover } = useGraphInteraction();

  const handleHover = useCallback(() => {
    setHover(type);
  }, [setHover, type]);
  const handleLeave = useCallback(() => {
    setHover(undefined);
  }, [setHover]);

  if (hide) {
    return null;
  }

  const title = getTitle(type);

  if (!keysCount && !['limit', 'active'].includes(type)) {
    return null;
  }

  return (
    <LegendStyle onMouseEnter={handleHover} onMouseLeave={handleLeave}>
      <Stack center gap="sm">
        <CircleStyle>
          <PartStyle $type={type} />
        </CircleStyle>
        <span>{title}</span>
        {(keysCount !== undefined && (
          <ChipStyle $type={type}>{keysCount.toString()}</ChipStyle>
        )) ||
          null}
      </Stack>
    </LegendStyle>
  );
};
