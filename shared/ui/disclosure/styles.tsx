import { IconPlus } from '@lidofinance/lido-app-ui';
import styled, { css } from 'styled-components';

export const DisclosureStyle = styled.div`
  width: 100%;
`;

export const HeaderStyle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 12px 0;
  border: none;
  background: none;
  cursor: pointer;
`;

export const LabelStyle = styled.span`
  color: var(--lido-app-ui-color-text-default);
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-label);
  font-weight: var(--lido-app-ui-font-weight-semibold);
  line-height: 24px;
  letter-spacing: var(--lido-app-ui-letter-spacing-label);
  text-align: left;
`;

export const IconStyle = styled(IconPlus)<{ $open: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--lido-app-ui-color-icons-secondary);
  transition: transform 0.2s ease;

  ${({ $open }) =>
    $open &&
    css`
      transform: rotate(45deg);
    `}
`;

export const ContentStyle = styled.div`
  padding-top: 16px;
`;
