import { Checkbox, IconLoaderCircle } from '@lidofinance/lido-app-ui';
import styled, { keyframes } from 'styled-components';

export const FieldErrorStyle = styled.p`
  margin: 0;
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-label);
  font-weight: var(--lido-app-ui-font-weight-regular);
  line-height: var(--lido-app-ui-line-height-label);
  letter-spacing: var(--lido-app-ui-letter-spacing-label);
  color: var(--lido-app-ui-color-text-error);
  word-break: break-word;
`;

export const CheckboxFieldStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CheckboxStyle = styled(Checkbox)`
  && {
    align-items: flex-start;
  }

  && input[aria-invalid='true'] {
    border-color: var(--lido-app-ui-color-border-error);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const AddressSpinnerStyle = styled(IconLoaderCircle)`
  width: 20px;
  height: 20px;
  animation: ${spin} 0.9s linear infinite;
`;

export const AddressLabelStyle = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const ConnectedAddressButtonStyle = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: var(--lido-app-ui-font-size-label);
  line-height: var(--lido-app-ui-line-height-label);
  color: var(--lido-app-ui-color-text-active);
  cursor: pointer;

  &:hover {
    color: var(--lido-app-ui-color-text-active-hover);
  }

  &:disabled {
    color: var(--lido-app-ui-color-text-disabled);
    cursor: not-allowed;
  }
`;

export const FieldStackStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TabLabelStyle = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;
