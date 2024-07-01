import styled from 'styled-components';

export const TitleStyle = styled.h5`
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: 1.5em;
  font-weight: 700;

  & > a {
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
    font-weight: 400;
    padding-inline-start: ${({ theme }) => theme.spaceMap.md}px;
  }
`;
