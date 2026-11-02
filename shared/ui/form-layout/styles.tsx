import styled from 'styled-components';

export const LayoutStyle = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  /* clip, not hidden: hidden makes this a scroll container and the sticky aside stops sticking */
  overflow: clip;
  border-radius: 20px;
  background-color: var(--lido-app-ui-color-background-surface);

  @media (max-width: 899px) {
    flex-direction: column;
  }
`;

export const MainStyle = styled.div`
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  padding: 32px;

  @media (max-width: 899px) {
    padding: 20px;
  }
`;

export const AsideStyle = styled.div`
  box-sizing: border-box;
  flex-shrink: 0;
  width: 340px;
  padding: 32px 20px;
  border-left: 1px solid var(--lido-app-ui-color-border-default);
  background-color: var(--lido-app-ui-color-background-default);

  @media (max-width: 899px) {
    width: 100%;
    padding: 20px;
    border-left: none;
    border-top: 1px solid var(--lido-app-ui-color-border-default);
  }
`;

export const AsideContentStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: sticky;
  top: 24px;
`;
