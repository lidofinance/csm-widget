import styled from 'styled-components';

export const ToggleTrackStyle = styled.button<{ $on: boolean }>`
  position: relative;
  width: 36px;
  height: 20px;
  border: none;
  border-radius: 10px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  background: ${({ $on }) =>
    $on ? 'var(--lido-color-primary)' : 'var(--lido-color-border)'};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background 0.15s ease;
  flex-shrink: 0;
`;

export const ToggleKnobStyle = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $on }) => ($on ? '18px' : '2px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.15s ease;
`;
