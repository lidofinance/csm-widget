import { Block, Theme, ThemeName } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

type InjectedProps = {
  theme: Theme;
};

const VARIANTS = {
  wary: css<InjectedProps>`
    background: ${({ theme }) =>
      theme.name === ThemeName.light
        ? 'linear-gradient(106deg, #F3FEBF 2.02%, #CCFBF1 99.17%)'
        : 'linear-gradient(106deg, #14532D 2.02%, #0B3C5D 99.17%)'};
  `,
  'wary-dangerous': css<InjectedProps>`
    background: ${({ theme }) =>
      theme.name === ThemeName.light
        ? 'linear-gradient(106deg, #FEF9BF 2.02%, #FFE0BC 99.17%)'
        : 'linear-gradient(106deg, #A8892A 2.02%, #8C6246 99.17%)'};
  `,
};

export type BannerVariant = keyof typeof VARIANTS;

export const BannerStyled = styled(Block)<{ $variant?: BannerVariant }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  ${({ $variant }) => ($variant ? VARIANTS[$variant] : '')}
`;

export const BannerHeader = styled.h3`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: bold;
  color: var(--lido-color-text);
`;

export const BannerContent = styled.div`
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
`;
