import styled from 'styled-components';

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
