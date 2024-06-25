import { ThemeName } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const RadioButtonStyle = styled.label`
  position: relative;
  padding: 16px 12px; // @style
  flex: 1 0 0%;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border: 1px solid var(--lido-color-border);
  background-color: ${({ theme }) =>
    theme.name === ThemeName.light ? '#F6F8FA' : '#252a2e'};

  &:has(:checked) {
    border: 2px solid var(--lido-color-primary);
    padding: 15px 11px;
  }

  &:not(:has(:disabled)) {
    cursor: pointer;
  }
`;

export const CheckboxInputStyle = styled.input`
  width: 1px;
  height: 1px;
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
`;
