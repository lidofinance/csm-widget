import { Block, ThemeName } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const BannerHeader = styled.h3`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: bold;
`;

export const BlockStyled = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding-inline: 10%; // @style

  text-align: center;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  background: ${({ theme }) =>
    theme.name === ThemeName.light
      ? 'linear-gradient(97.63deg, #befce2 5.91%, #cdefed 66.16%)'
      : 'linear-gradient(97.63deg, #2aa672 5.91%, #095550 66.16%)'};
`;
