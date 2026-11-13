import { Card } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const SuccessHeroStyle = styled(Card)`
  && {
    padding: 52px 32px;
    text-align: center;
  }

  @media (max-width: 899px) {
    && {
      padding: 52px 20px;
    }
  }
`;

export const SuccessIconStyle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  border-radius: var(--lido-app-ui-border-radius-pill);
  background: var(--lido-app-ui-color-icons-success);
  color: var(--lido-app-ui-color-text-inverse);

  svg {
    width: 40px;
    height: 40px;
  }
`;

export const SuccessIllustrationStyle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const SuccessActionsStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 40px;
`;

export const VisuallyHiddenStyle = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;
