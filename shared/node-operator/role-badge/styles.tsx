import styled from 'styled-components';

export type BackgroundColorsType = 'normal' | 'dark';

const backgroundMap = {
  normal: 'var(--lido-color-background)',
  dark: 'var(--lido-color-shadowLight)',
};

export const BadgeStyle = styled.div<{ $background: BackgroundColorsType }>`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  padding: 2px 8px;
  min-width: 28px;
  line-height: 24px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  background: ${({ $background }) => backgroundMap[$background]};
  color: var(--lido-color-textSecondary);
`;
