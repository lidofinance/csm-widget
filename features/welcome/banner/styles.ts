import styled from 'styled-components';

export const BannerHeader = styled.h3`
  color: var(--lido-color-text);
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  font-weight: bold;
  line-height: 24px;
`;
