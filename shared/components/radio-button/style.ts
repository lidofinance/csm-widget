import { ThemeName } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import { ReactComponent as Radio } from 'assets/icons/radio.svg';

export const RadioIconStyle = styled(Radio)`
  align-self: center;
  height: 24px;
  width: 24px;
  border-radius: 24px;
  transition:
    box-shadow 0.1s ease,
    background-color 0.1s ease;
  fill: var(--lido-color-primaryContrast);

  background-color: var(--lido-color-controlBg);
  box-shadow: inset 0 0 0 1px var(--lido-color-border);

  path {
    opacity: 0;
  }
`;

export const RadioButtonStyle = styled.label`
  position: relative;
  padding: 16px 12px; // @style
  flex: 1 0 0%;

  :has(${RadioIconStyle}) {
    padding: 16px 20px;
  }

  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border: 1px solid var(--lido-color-border);
  background-color: ${({ theme }) =>
    theme.name === ThemeName.light ? '#F6F8FA' : '#252a2e'};

  :has(:checked) {
    border: 2px solid var(--lido-color-primary);
    padding: 15px 11px;

    :has(${RadioIconStyle}) {
      padding: 15px 19px;
    }

    ${RadioIconStyle} {
      background-color: var(--lido-color-primary);
      box-shadow: none;

      path {
        opacity: 1;
      }
    }
  }

  :hover:not(:has(:disabled)) {
    background-color: ${({ theme }) =>
      theme.name === ThemeName.light ? '#ebf8ff' : '#24343b'};

    :not(:has(:checked)) {
      border: 1px solid var(--lido-color-primary);

      ${RadioIconStyle} {
        box-shadow: inset 0 0 0 1px var(--lido-color-borderHover);
      }
    }
  }

  :has(input:focus-visible) {
    ${RadioIconStyle} {
      box-shadow: inset 0 0 0 1px var(--lido-color-primary);
    }
  }

  :has(input:focus-visible:checked) {
    ${RadioIconStyle} {
      box-shadow: inset 0 0 0 1px var(--lido-color-borderHover);
    }
  }

  :has(:disabled) {
    ${RadioIconStyle} {
      opacity: 0.5;
    }
  }

  :not(:has(:disabled)) {
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
