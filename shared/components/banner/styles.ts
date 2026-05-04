import { Block, Theme, ThemeName } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';
import { StackStyle } from '../stack/style';

type InjectedProps = {
  theme: Theme;
};

export const BannerHeader = styled.h3`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: bold;
  color: var(--lido-color-text);
`;

export const BannerContent = styled.div<{ $center?: boolean }>`
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  ${({ $center }) =>
    $center &&
    css`
      text-align: center;
    `}
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
        114.67% 199.49% at 51.78% 123.98%,
        #ef81f9 0%,
        rgba(249, 129, 183, 0) 100%
      ),
      linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%);
  `,
  secondary: css`
    background: ${({ theme }) =>
      theme.name === ThemeName.light ? '#d8e0ea' : '#676772'};
    text-align: center;

    ${BannerHeader} {
      text-align: center;
    }
    ${StackStyle} {
      justify-content: center;
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
