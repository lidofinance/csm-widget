import { Body, Button } from '@lidofinance/lido-app-ui';
import styled, { CSSProperties } from 'styled-components';

export const CardHeaderStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  text-align: center;
`;

export const CardDescriptionStyle = styled(Body)`
  && {
    color: var(--lido-app-ui-color-text-secondary);
  }
`;

export const CardBodyStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

export const BadgesStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 8px;
`;

export const BadgeStyle = styled.img`
  flex: none;
  width: 120px;
  height: 120px;

  @media (max-width: 439px) {
    width: 96px;
    height: 96px;
  }
`;

export const BadgeJoinStyle = styled.span`
  display: inline-flex;
  color: var(--lido-app-ui-color-icons-secondary);

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const ChangesBoxStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
  padding: 24px;
  border-radius: var(--lido-app-ui-border-radius-card);
  background: var(--lido-app-ui-color-background-secondary);

  @media (max-width: 439px) {
    padding: 16px;
  }
`;

export const FaintStyle = styled.span`
  margin-left: 6px;
  color: var(--lido-app-ui-color-text-tertiary);
  font-size: 12px;
  line-height: 16px;
`;

export const CompareRowStyle = styled.div<{ $head?: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  column-gap: 16px;
  padding: ${({ $head }) => ($head ? '0 0 8px' : '12px 0')};
  border-top: ${({ $head }) =>
    $head ? 'none' : '1px solid var(--lido-app-ui-color-border-subtle)'};
  color: ${({ $head }) =>
    $head
      ? 'var(--lido-app-ui-color-text-tertiary)'
      : 'var(--lido-app-ui-color-text-default)'};
  font-size: 14px;
  line-height: 20px;
`;

export const SuccessBadgeStyle = styled.img`
  width: 240px;
  height: 240px;

  @media (max-width: 439px) {
    width: 160px;
    height: 160px;
  }
`;

export const AmazingButtonStyle = styled(Button)`
  && {
    width: 100%;
  }
`;

export const confettiCanvasStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 9999,
};
