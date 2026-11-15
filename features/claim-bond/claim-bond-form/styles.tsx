import styled from 'styled-components';

export const ClaimOptionIconsStyle = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
`;

export const RewardsAddressChipStyle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--lido-app-ui-color-background-secondary);
  color: var(--lido-app-ui-color-text-secondary);
  font-size: var(--lido-app-ui-font-size-tooltip);
  font-weight: var(--lido-app-ui-font-weight-semibold);
`;
