import { Button, Card } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const FormPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

export const SkeletonCardStyle = styled(Card)`
  && {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

export const SubmitAsideStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const CtaStackStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FullWidthButtonStyle = styled(Button)`
  && {
    width: 100%;
  }
`;

export const SuccessScreenStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SuccessHeroStyle = styled(Card)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
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

export const SuccessStatsStyle = styled(Card)`
  && {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    align-items: start;
    gap: 24px;
  }
`;

export const SuccessCardStyle = styled(Card)`
  && {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }
`;

export const SuccessActionsStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 40px;
`;

export const WizardStepperStyle = styled.div`
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
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
