import styled, { css } from 'styled-components';

export const HubListStyle = styled.div`
  align-self: stretch;
  width: 100%;
`;

export const HubOverlineStyle = styled.div`
  padding: 0 0 8px;
`;

export const HubFooterStyle = styled.div`
  padding: 16px 8px 0;
`;

export const HubDividerStyle = styled.div`
  border-top: 1px solid var(--lido-app-ui-color-border-default);
`;

export const hubRowCss = css`
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px 12px;

  /* only rows with trailing actions wrap them under the title on mobile */
  &[data-wrap='true'] {
    flex-wrap: wrap;
  }
  box-sizing: border-box;
  min-height: 60px;
  padding: 12px 8px;
  text-decoration: none;

  &&,
  &&:visited,
  &&:hover {
    color: var(--lido-app-ui-color-text-default);
  }
`;

export const HubRowStyle = styled.div`
  ${hubRowCss}
`;

export const hubRowLinkCss = css`
  cursor: pointer;

  &:hover {
    background: var(--lido-app-ui-color-background-transparent-hover);
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
  margin-right: 8px;
`;

export const HubMainStyle = styled.div`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 4px;
  /* never narrower than the unwrapped title; the value side gives way instead */
  min-width: min-content;
`;

export const HubTitleRowStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const HubTitleTextStyle = styled.span`
  white-space: nowrap;
`;

export const HubValueStyle = styled.span`
  display: block;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HubAsideStyle = styled.div`
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  margin-left: auto;
`;

export const HubTrailingStyle = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
  min-width: 0;

  @media (max-width: 440px) {
    flex: 1 1 100%;
    order: 1;
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
