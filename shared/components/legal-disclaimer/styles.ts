import styled from 'styled-components';

export const LegalDisclaimerBlock = styled.section`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  padding-inline: 4px;
  padding-top: ${({ theme }) => theme.spaceMap.xxl}px;
  margin-top: auto;
`;
