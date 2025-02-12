import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { useHover } from './hover-provider';
import { ChipStyle, CircleStyle, LegendStyle, PartStyle } from './style';
import { GraphPart } from './types';

export const Legend: FC<{
  type: GraphPart;
  title: string;
  count?: number;
  approx?: boolean;
}> = ({ type, title, count, approx }) => {
  const { setHover } = useHover();

  const handleHover = useCallback(() => {
    setHover(type);
  }, [setHover, type]);
  const handleLeave = useCallback(() => {
    setHover(undefined);
  }, [setHover]);

  return (
    <LegendStyle onMouseEnter={handleHover} onMouseLeave={handleLeave}>
      <Stack center gap="sm">
        <CircleStyle>
          <PartStyle $type={type} />
        </CircleStyle>
        <span>{title}</span>
        {(count !== undefined && (
          <ChipStyle $type={type}>
            {count && approx ? '~' : ''}
            {count}
          </ChipStyle>
        )) ||
          null}
      </Stack>
    </LegendStyle>
  );
};
