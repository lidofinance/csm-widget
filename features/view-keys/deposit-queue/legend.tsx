import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { useHover } from './hover-provider';
import { ChipStyle, CircleStyle, LegendStyle, PartStyle } from './style';
import { GraphPart } from './types';

type LegendProps = {
  type: GraphPart;
  title: string;
  count?: string;
  hide?: boolean;
};

export const Legend: FC<LegendProps> = ({
  type,
  title,
  count,
  hide = false,
}) => {
  const { setHover } = useHover();

  const handleHover = useCallback(() => {
    setHover(type);
  }, [setHover, type]);
  const handleLeave = useCallback(() => {
    setHover(undefined);
  }, [setHover]);

  if (hide) {
    return null;
  }

  return (
    <LegendStyle onMouseEnter={handleHover} onMouseLeave={handleLeave}>
      <Stack center gap="sm">
        <CircleStyle>
          <PartStyle $type={type} />
        </CircleStyle>
        <span>{title}</span>
        {(count !== undefined && (
          <ChipStyle $type={type} $loading={count === '...'}>
            {count}
          </ChipStyle>
        )) ||
          null}
      </Stack>
    </LegendStyle>
  );
};
