import styled from 'styled-components';

export const InviteContentStyle = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  color: var(--lido-color-text);
`;

export const Badge = styled.span`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px 8px;

  background: var(--lido-color-background);
  background: var(--lido-color-shadowLight);
  color: var(--lido-color-textSecondary);
`;
