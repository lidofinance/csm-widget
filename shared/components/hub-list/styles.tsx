import { Card } from '@lidofinance/lido-app-ui';
import styled, { css } from 'styled-components';

export const HubCardStyle = styled(Card)`
  && {
    display: block;
    padding: 24px 32px;
  }
`;

export const HubOverlineStyle = styled.div`
  padding: 0 8px 8px;
`;

export const HubDividerStyle = styled.div`
  border-top: 1px solid var(--lido-app-ui-color-border-default);
`;

export const hubRowCss = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  box-sizing: border-box;
  padding: 16px 8px;
  border-radius: var(--lido-app-ui-border-radius-card);
  color: var(--lido-app-ui-color-text-default);
  text-decoration: none;
`;

export const HubRowStyle = styled.div`
  ${hubRowCss}
`;

export const hubRowLinkCss = css`
  cursor: pointer;

  &:hover {
    background: var(--lido-app-ui-color-background-surface-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--lido-app-ui-color-border-active);
    outline-offset: 2px;
  }
`;

export const HubMediaStyle = styled.div`
  display: flex;
  flex: none;
  align-items: center;
`;

export const HubMainStyle = styled.div`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const HubTitleRowStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const HubAsideStyle = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;

  @media (max-width: 440px) {
    flex: 1 1 100%;
    justify-content: flex-start;
  }
`;

export const HubChevronStyle = styled.span`
  display: inline-flex;
  flex: none;
  color: var(--lido-app-ui-color-icons-secondary);

  svg {
    width: 20px;
    height: 20px;
  }
`;
