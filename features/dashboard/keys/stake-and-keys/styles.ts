import styled from 'styled-components';

export const StakeRow = styled.div`
  padding: 12px 16px;
  display: flex;
  gap: 12px;
`;

export const StakeColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const StakeTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 20px;
  color: var(--lido-color-textSecondary);
`;

export const StakeAmount = styled.b`
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`;

export const StakeKeys = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: var(--lido-color-textSecondary);
`;

export const ColorDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const StakeBar = styled.div`
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
  display: inline-block;
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  transition: width 0.25s ease-in-out;
`;
