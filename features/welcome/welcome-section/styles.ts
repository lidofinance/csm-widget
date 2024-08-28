import { Block, ThemeName } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import LogoDark from 'assets/csm-dark.png';
import LogoLight from 'assets/csm-light.png';

export const Header = styled.h1`
  font-size: 48px; // @style
  line-height: 52px; // @style
  font-weight: 600;
`;

export const Heading = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-inline: 32px;

  line-height: 52px;
  color: var(--lido-color-text);

  @media screen and (max-width: 540px) {
    padding-inline: 0;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  text-align: left;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;

  ul {
    color: var(--lido-color-primary);
    padding-inline-start: 22px;
  }
`;

export const BlockStyled = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  border-radius: 32px; // @style

  text-align: center;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
`;

export const CSMLogo = styled.img.attrs(({ theme }) => ({
  alt: '',
  src: theme.name === ThemeName.light ? LogoLight.src : LogoDark.src,
}))`
  width: 55%;
  display: flex;
  align-self: center;
  margin-bottom: -4%;
`;
