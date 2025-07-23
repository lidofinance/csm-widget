import styled from 'styled-components';

export const SectionHeaderStyle = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
`;

export const SectionTitleStyle = styled.h2`
  font-weight: 800;
  font-size: ${({ theme }) => theme.fontSizesMap.md}px;
  line-height: 1.3em;
  color: var(--lido-color-text);
`;
