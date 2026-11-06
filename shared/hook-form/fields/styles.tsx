import { Checkbox, Input, Spinner } from '@lidofinance/lido-app-ui';
import styled, { css } from 'styled-components';

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

// matches the 20px Identicon in the same slot
export const AddressSpinnerStyle = styled(Spinner)`
  && {
    --spinner-size: 20px;
  }
`;

export const AddressLabelStyle = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

// app-ui Input has no suffix slot: with $trailing its icon slot moves after the input
export const TrailingInputStyle = styled(Input)<{ $trailing: boolean }>`
  ${({ $trailing }) =>
    $trailing &&
    css`
      && label > span[aria-hidden='true'] {
        order: 1;
        width: auto;
        height: auto;
      }
    `}
`;

export const PercentSuffixStyle = styled.span`
  color: var(--lido-app-ui-color-text-secondary);
  font-size: var(--lido-app-ui-font-size-body);
  line-height: var(--lido-app-ui-line-height-body);
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

export const KeyListStyle = styled.div<{ $invalid: boolean }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid
    ${({ $invalid }) =>
      $invalid
        ? 'var(--lido-app-ui-color-border-error)'
        : 'var(--lido-app-ui-color-border-default)'};
  border-radius: var(--lido-app-ui-border-radius-card);
`;

export const KeyRowStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: var(--lido-app-ui-color-background-default);

  & + & {
    border-top: 1px solid var(--lido-app-ui-color-border-default);
  }
`;

export const KeyCheckboxStyle = styled(Checkbox)`
  && {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  && > span:last-child {
    flex: 1;
    min-width: 0;
  }
`;

export const KeyLabelStyle = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

// both trims stay in the DOM so the desktop text the e2e matches is always present
export const KeyPubkeyStyle = styled.span`
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  & > span:last-child {
    display: none;
  }

  @media (max-width: 439px) {
    & > span:first-child {
      display: none;
    }

    & > span:last-child {
      display: inline;
    }
  }
`;

export const KeyTagsStyle = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
`;
