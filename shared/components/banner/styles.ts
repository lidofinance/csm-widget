import { Block, Theme, ThemeName } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

type InjectedProps = {
  theme: Theme;
};

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

  sunset: css`
    background: radial-gradient(
        1435.85% 196.07% at 95.46% -44.7%,
        rgba(34, 56, 255, 0.8) 0%,
        rgba(235, 0, 255, 0.4) 100%
      ),
      linear-gradient(102deg, #bae6fd -8.89%, #93c5fd 105.62%);

    ${BannerHeader} {
      text-align: center;
    }
  `,
};

export type BannerVariant = keyof typeof VARIANTS;

export const BannerStyled = styled(Block)<{ $variant?: BannerVariant }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;

  ${({ $variant }) => ($variant ? VARIANTS[$variant] : '')}
`;
