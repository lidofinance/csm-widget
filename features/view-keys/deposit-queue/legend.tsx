import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { useGraphInteraction } from './hover-provider';
import { ChipStyle, CircleStyle, LegendStyle, PartStyle } from './style';
import { getPriorityName } from './get-priority-name';
import { GraphPart } from './types';

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

  const title = getPriorityName(type);

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
