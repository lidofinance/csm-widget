import styled from 'styled-components';

export const NoteStyle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--lido-app-ui-color-text-secondary);
`;

export const OptionIconsStyle = styled.span`
  display: inline-flex;
  gap: 4px;

  svg {
    width: 22px;
    height: 22px;
  }
`;

export const ErrorValueStyle = styled.span`
  color: var(--lido-app-ui-color-text-error);
`;

export const StatsGridStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 899px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const StatCardBodyStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SplittersSummaryStyle = styled.span`
  display: flex;
  flex: 1;
  justify-content: space-between;
  gap: 16px;
`;

export const EmptyStateStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 0;
  text-align: center;

  svg {
    color: var(--lido-app-ui-color-text-secondary);
    opacity: 0.8;
  }
`;
