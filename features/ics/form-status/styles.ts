import styled from 'styled-components';

export const ScoreIconStyle = styled.span<{ $passed: boolean }>`
  display: inline-flex;
  color: ${({ $passed }) =>
    $passed
      ? 'var(--lido-app-ui-color-icons-success)'
      : 'var(--lido-app-ui-color-icons-error)'};
`;
