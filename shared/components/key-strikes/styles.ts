import styled from 'styled-components';

export const Circle = styled.div<{ $red?: boolean }>`
  height: 12px;
  width: 12px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: ${({ $red = false }) =>
    $red ? 'var(--lido-color-error)' : 'var(--lido-color-success)'};
  overflow: hidden;
  position: relative;
  white-space: nowrap;
`;
