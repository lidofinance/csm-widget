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

export const DisclosureHeaderStyle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px 16px;
  width: 100%;
  min-height: 23px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  color: var(--lido-app-ui-color-text-secondary);
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-label);
  font-weight: var(--lido-app-ui-font-weight-regular);
  letter-spacing: var(--lido-app-ui-letter-spacing-label);
  line-height: var(--lido-app-ui-line-height-label);
  text-align: left;

  > span:last-child {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--lido-app-ui-color-text-default);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
  }

  svg[data-open='true'] {
    transform: rotate(180deg);
  }
`;

export const DisclosureBodyStyle = styled.div`
  margin-top: 8px;
  padding-left: 12px;
`;
