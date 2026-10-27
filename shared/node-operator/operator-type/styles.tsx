import styled from 'styled-components';

export const BadgeButtonStyle = styled.button`
  display: block;
  width: max-content;
  padding: 0;
  font: inherit;
  color: inherit;
  border: none;
  background: none;
  cursor: pointer;

  &:not(:disabled):hover {
    opacity: 0.85;
  }

  &:disabled {
    cursor: default;
  }
`;
