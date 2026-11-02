import { Card } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const TypeColumnsStyle = styled(Card)`
  && {
    flex-direction: row;
    align-items: stretch;
    gap: 0;
  }

  @media (max-width: 899px) {
    && {
      flex-direction: column;
    }
  }
`;

export const TypeColumnStyle = styled.div`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

  & + & {
    margin-left: 24px;
    padding-left: 24px;
    border-left: 1px solid var(--lido-app-ui-color-border-default);
  }

  @media (max-width: 899px) {
    & + & {
      margin: 24px 0 0;
      padding: 24px 0 0;
      border-left: none;
      border-top: 1px solid var(--lido-app-ui-color-border-default);
    }
  }
`;

export const TypeTextStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TypeCtaStyle = styled.div`
  margin-top: auto;

  a {
    display: block;
  }

  && button {
    width: 100%;
  }
`;

export const ParametersStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  line-height: 20px;
`;

export const ParameterGroupStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ParameterTitleStyle = styled.span`
  font-weight: var(--lido-app-ui-font-weight-bold);
`;

export const ParameterRowStyle = styled.div<{ $strong?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: ${({ $strong }) =>
    $strong
      ? 'var(--lido-app-ui-color-text-default)'
      : 'var(--lido-app-ui-color-text-secondary)'};
  font-weight: ${({ $strong }) =>
    $strong
      ? 'var(--lido-app-ui-font-weight-bold)'
      : 'var(--lido-app-ui-font-weight-regular)'};

  & > :last-child {
    color: var(--lido-app-ui-color-text-default);
    font-weight: var(--lido-app-ui-font-weight-bold);
  }
`;
