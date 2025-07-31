import styled from 'styled-components';

export const BadgeStyle = styled.span`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  min-width: 28px;
  height: 28px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  text-transform: capitalize;
`;

export const BadgeRoleStyle = styled(BadgeStyle)`
  background: var(--lido-color-background);
  color: var(--lido-color-textSecondary);
`;
