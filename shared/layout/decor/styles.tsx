import styled from 'styled-components';

import HoSrc from 'assets/decor/hohoho.svg';
import MerrySrc from 'assets/decor/merry.svg';
import SantaSrc from 'assets/decor/santa.svg';
import SnowSrc from 'assets/decor/snow.svg';

import DecorLeft from 'assets/decor/decor-1.svg';
import DecorLeftDark from 'assets/decor/decor-1-dark.svg';
import DecorRight from 'assets/decor/decor-2.svg';
import DecorRightDark from 'assets/decor/decor-2-dark.svg';
import { ThemeName } from '@lidofinance/lido-ui';

export const DecorWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  pointer-events: none;
`;

const DecorStyle = styled.img`
  position: absolute;

  ${({ theme }) => theme.mediaQueries.xl} {
    transform: scale(0.9);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    transform: scale(0.8);
  }
`;

export const DecorLeftStyle = styled(DecorStyle).attrs(({ theme }) => ({
  alt: 'Decor Left',
  src: theme.name === ThemeName.dark ? DecorLeftDark : DecorLeft,
}))`
  top: -40px;
  left: -25px;
  transform-origin: top left;
`;

export const DecorRightStyle = styled(DecorStyle).attrs(({ theme }) => ({
  alt: 'Decor Right',
  src: theme.name === ThemeName.dark ? DecorRightDark : DecorRight,
}))`
  right: -30px;
  top: -18px;
  transform-origin: top right;
`;

export const SantaWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  right: 100px;
  width: 0;
  height: auto;

  transform-origin: bottom right;

  ${({ theme }) => theme.mediaQueries.lg} {
    transform: scale(0.8);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`;

export const SantaStyle = styled.img.attrs({
  alt: 'Santa',
  src: SantaSrc,
})<{ $visible?: boolean }>`
  clip-path: polygon(
    0 100%,
    2% 86%,
    11% 73%,
    12% 54%,
    12% 22%,
    17% 7%,
    28% 0,
    56% 0,
    65% 8%,
    72% 25%,
    74% 44%,
    78% 68%,
    92% 81%,
    100% 100%
  );
  --offset: -106px;
  --santa-visible-offset: ${({ $visible }) =>
    $visible ? 'var(--offset)' : '0px'};
  --santa-hover-offset: 0px;

  position: absolute;
  bottom: var(--offset);
  right: 0px;
  height: auto;

  z-index: 10;
  cursor: pointer;

  transform: translateY(
    min(var(--santa-visible-offset), var(--santa-hover-offset))
  );

  transition:
    --santa-visible-offset 0.3s ease
      ${({ $visible }) => ($visible ? '0s' : '0.8s')},
    --santa-hover-offset 0.3s ease 0s;

  @media only screen and (hover: hover) and (pointer: fine) {
    :hover {
      --santa-hover-offset: var(--offset);
    }
  }
`;

export const HoHoHoStyle = styled.img.attrs({
  alt: 'Ho Ho Ho',
  src: HoSrc,
})<{ $visible?: boolean }>`
  pointer-events: none;
  position: absolute;
  top: -275px;
  right: 30px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? 0 : '20px')});
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
  transition-delay: 0.3s;
`;

export const TextStyle = styled.img.attrs({
  alt: 'Merry Christmas',
  src: MerrySrc,
})<{ $visible?: boolean }>`
  pointer-events: none;
  position: absolute;
  top: -264px;
  right: -108px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? 0 : '20px')});
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
  transition-delay: 0.5s;
`;

export const SnowStyle = styled.img.attrs({
  alt: 'Snow',
  src: SnowSrc,
})`
  position: fixed;
  bottom: 0;
  left: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  :hover {
    opacity: 0.7;
  }

  animation: snowFade linear;
  animation-timeline: scroll();
  animation-range: calc(100% - 72px) 100%;

  @keyframes snowFade {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.6;
    }
  }

  transform-origin: bottom left;

  ${({ theme }) => theme.mediaQueries.lg} {
    transform: scale(0.8);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`;
