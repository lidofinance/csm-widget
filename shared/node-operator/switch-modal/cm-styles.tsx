import styled from 'styled-components';
import { BadgeRoleStyle } from '../role-badge/styles';

export const GroupCardsStyle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding-left: 12px;

  &::before {
    content: '';
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 2px;
    background: var(--lido-color-border);
    border-radius: 1px;
  }
`;

export const CmRowStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: var(--lido-color-backgroundSecondary);
  border-radius: 10px;
  padding: 12px;

  ${BadgeRoleStyle} {
    background: var(--lido-color-shadowLight);
  }
`;

export const CmRowDescriptor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 20px;
  min-width: 0;
`;

export const CompactBar = styled.div`
  display: flex;
  gap: 1px;
  height: 4px;
  width: 100%;
  border-radius: 2px;
  background: var(--lido-color-backgroundSecondary);
  overflow: hidden;
`;

export const CompactBarSegment = styled.div<{
  $color: string;
  $width: number;
}>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  transition: width 0.25s ease-in-out;
  display: ${({ $width }) => ($width <= 0 ? 'none' : 'block')};
`;
