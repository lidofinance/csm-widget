import { Spinner } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

// matches the 20px Identicon in the same slot
export const AddressSpinnerStyle = styled(Spinner)`
  && {
    --spinner-size: 20px;
  }
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
