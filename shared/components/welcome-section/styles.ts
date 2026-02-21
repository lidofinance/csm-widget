import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { Block, ThemeName } from '@lidofinance/lido-ui';
import { config } from 'config';
import styled from 'styled-components';

import LogoCsmDark from 'assets/csm-dark.png';
import LogoCsmLight from 'assets/csm-light.png';
import LogoCmDark from 'assets/cm-dark.png';
import LogoCmLight from 'assets/cm-light.png';

const LOGOS = {
  [MODULE_NAME.CSM]: {
    [ThemeName.dark]: LogoCsmDark.src,
    [ThemeName.light]: LogoCsmLight.src,
  },
  [MODULE_NAME.CSM0x02]: {
    [ThemeName.dark]: LogoCsmDark.src,
    [ThemeName.light]: LogoCsmLight.src,
  },
  [MODULE_NAME.CM]: {
    [ThemeName.dark]: LogoCmDark.src,
    [ThemeName.light]: LogoCmLight.src,
  },
};

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

export const ModuleLogo = styled.img.attrs(({ theme }) => ({
  alt: '',
  src: LOGOS[config.module][theme.name],
}))`
  width: 55%;
  display: flex;
  align-self: center;
  margin-bottom: -4%;
`;
