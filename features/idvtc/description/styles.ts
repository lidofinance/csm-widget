import styled from 'styled-components';

export const CriterionStyle = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:not(:last-child) {
    padding-bottom: 24px;
    border-bottom: 1px solid var(--lido-app-ui-color-border-default);
  }
`;

export const CriteriaContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--lido-app-ui-color-text-secondary);
  font-size: 14px;
  line-height: 24px;

  p,
  ul {
    margin: 0;
  }

  ul {
    list-style-type: disc;
    padding-left: 20px;

    ul {
      list-style-type: circle;
    }
  }
`;
