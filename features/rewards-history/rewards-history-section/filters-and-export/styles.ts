import styled from 'styled-components';

export const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: ${({ theme }) => theme.spaceMap.md}px
    ${({ theme }) => theme.spaceMap.xxl}px
    calc(${({ theme }) => theme.spaceMap.md}px - 1px);

  border-bottom: 1px solid var(--lido-color-border);
`;
