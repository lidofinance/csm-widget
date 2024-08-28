import styled from 'styled-components';

export type BackgroundColorsType = 'normal' | 'dark';

export const BadgeStyle = styled.div`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  padding: 2px 8px;
  min-width: 28px;
  line-height: 24px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  background: var(--lido-color-background);
  color: var(--lido-color-textSecondary);
  text-transform: capitalize;
`;
