import { WarningTextStyle } from 'shared/components/warning/style';
import styled from 'styled-components';

export const RoleBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  gap: 12px;
  align-items: start;
  border: 1px solid var(--lido-color-border);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: 12px;
  min-width: 240px;
`;

export const RoleBlockProposed = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(var(--lido-rgb-warning), 0.1);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  padding: ${({ theme }) => theme.spaceMap.xs}px
    ${({ theme }) => theme.spaceMap.sm}px;

  ${WarningTextStyle} {
    gap: ${({ theme }) => theme.spaceMap.xs}px;
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const RoleTitle = styled.h4`
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 400;
`;
