import { FC } from 'react';
import styled from 'styled-components';

const Track = styled.button<{ $on: boolean }>`
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

const Knob = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $on }) => ($on ? '18px' : '2px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.15s ease;
`;

type Props = {
  on: boolean;
  disabled?: boolean;
  onToggle?: (active: boolean) => void;
};

export const DkgFileToggle: FC<Props> = ({ on, disabled, onToggle }) => (
  <Track
    type="button"
    $on={on}
    disabled={disabled}
    role="switch"
    aria-checked={on}
    onClick={disabled ? undefined : () => onToggle?.(!on)}
  >
    <Knob $on={on} />
  </Track>
);
