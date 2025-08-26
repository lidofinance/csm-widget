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

export const Chip = styled.span`
  position: relative;
  overflow: hidden;
  padding: 0px 6px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  /* background-color:; */

  align-content: center;
  color: var(--lido-color-primary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;

  ::before {
    content: '';
    position: absolute;
    display: block;

    background-color: var(--lido-color-primary);
    transition: opacity 100ms ease 0s;
    opacity: 0.1;
    inset: 0px;
  }
`;

export const OwnerChip = styled(Chip)`
  font-weight: 400;
  color: var(--lido-color-textSecondary);
  background: color-mix(in srgb, currentColor 15%, transparent);
`;

export const RoleTitle = styled.h4`
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 400;
`;
