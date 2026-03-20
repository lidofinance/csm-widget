import styled from 'styled-components';

export const StakeRow = styled.div`
  padding: 12px 16px;
  display: flex;
  gap: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
  }
`;

export const StakeColumn = styled.div`
  min-width: 25%;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ColorDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const StakeBar = styled.div`
  display: flex;
  gap: 1px;
  height: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: var(--lido-color-backgroundSecondary);
  overflow: hidden;
  white-space: nowrap;
`;

export const StakeBarSegment = styled.div<{
  $color: string;
  $width: number;
}>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  transition: width 0.25s ease-in-out;
  display: ${({ $width }) => ($width <= 0 ? 'none' : 'block')};
`;
