import { ThemeName } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components';
import styled, { css } from 'styled-components';
import { GraphPart } from './types';

export const WrapperStyle = styled.div`
  position: relative;
`;

export const FarStyle = styled.div<{ hidden?: boolean }>`
  position: absolute;
  display: block;
  z-index: 1;
  width: 10%;
  top: 0%;
  bottom: 0%;
  opacity: ${({ hidden }) => (hidden ? 0 : 1)};
  transition: opacity 0.25s ease-in-out;
  background: linear-gradient(
    90deg,
    var(--lido-color-foreground) 15%,
    rgba(255, 255, 255, 0) 80%
  );
`;

export const LineStyle = styled.div`
  height: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: var(--lido-color-backgroundSecondary);
  overflow: hidden;
  position: relative;
  white-space: nowrap;
`;

type PartProps = {
  $type: GraphPart;
  $size?: number;
  $offset?: number;
  $fade?: boolean;
};

const linearGradient = (
  color1: string,
  color2: string,
  angle = 120,
  w1 = 4,
  w2 = 4,
) => css`
  background: repeating-linear-gradient(
    ${angle}deg,
    ${color1},
    ${color1} ${w1}px,
    ${color2} ${w1}px,
    ${color2} ${w1 + w2}px
  );
  background-attachment: fixed;
  background-position-x: 0px;
`;

const PART_VARIANTS = {
  active: css`
    background: #53ba95;
  `,
  queued: css`
    ${linearGradient('#00a3ff', '#26b1ff')}
  `,
  queuedOverLimit: css`
    ${linearGradient('#81d1ff', '#94d8ff')}
  `,
  yourQueued: css<PartProps>`
    position: absolute;
    left: ${({ $offset }) => $offset}%;

    ${linearGradient('#ffa276', '#ffb695')}
  `,
  added: css`
    background: #f17ecb;
  `,
  limit: css<PartProps>`
    position: absolute;
    width: 2px;
    left: calc(${({ $offset = 50 }) => $offset}% - 1px);

    top: -40%;
    height: 180%;

    ${linearGradient('var(--lido-color-text)', 'transparent', 0, 5, 3)}
    background-attachment: initial;

    mix-blend-mode: ${({ theme }) =>
      theme.name === ThemeName.light ? 'multiply' : 'plus-lighter'};
  `,
};

export const PartStyle = styled.div<PartProps>`
  display: inline-block;
  height: 100%;
  width: ${({ $size = 100 }) => $size}%;
  opacity: ${({ $fade }) => ($fade ? '0.2' : '1')};
  transition:
    opacity 0.25s ease-in-out,
    left 0.25s ease-in-out,
    width 0.25s ease-in-out;

  ${(props) => PART_VARIANTS[props.$type]}
`;

export const CircleStyle = styled(LineStyle)`
  width: ${({ theme }) => theme.spaceMap.md}px;
`;

export const LegendStyle = styled.div`
  cursor: pointer;
`;

export const LegendsStyle = styled(StackStyle)`
  flex-wrap: wrap;
  gap: 12px 24px;
`;

const CHIP_VARIANTS = {
  active: css`
    color: #53ba95;
  `,
  queued: css`
    color: #00a3ff;
  `,
  queuedOverLimit: css`
    color: #81d1ff;
  `,
  yourQueued: css`
    color: #ffa276;
  `,
  added: css`
    color: #f17ecb;
  `,
  limit: css``,
};

export const ChipStyle = styled.div<{ $type?: GraphPart; $loading?: boolean }>`
  width: fit-content;
  padding: 0px 4px;
  text-align: center;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  background: color-mix(in srgb, currentColor 15%, transparent);

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;
  ${(props) => CHIP_VARIANTS[props.$type || 'active']}

  ${({ $loading }) =>
    $loading
      ? css`
          --loader-color: color-mix(in srgb, currentColor 15%, transparent);
          animation: cLMtGC 2s infinite;
          background-size: 300% 100%;
          background-position: 100% 0;
          background-image: linear-gradient(
            90deg,
            var(--loader-color) 0,
            var(--loader-color) 33.33%,
            transparent 44.44%,
            transparent 55.55%,
            var(--loader-color) 66.66%,
            var(--loader-color) 100%
          );
        `
      : ''}
`;
