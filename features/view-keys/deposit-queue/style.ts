import { ThemeName } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components';
import styled, { css } from 'styled-components';
import { GraphPart } from './types';

const COLOR_VARIANTS = {
  active: css`
    color: #53ba95;
  `,
  queue: css`
    color: #00a3ff;
  `,
  priority0: css`
    color: #00d4ff;
  `,
  priority1: css`
    color: #00a3ff;
  `,
  priority2: css`
    color: #5e8fff;
  `,
  priority3: css`
    color: #808cff;
  `,
  priority4: css`
    color: #a366ff;
  `,
  priority5: css`
    color: #c747ff;
  `,
  queueOverLimit: css`
    color: #81d1ff;
  `,
  priority0OverLimit: css`
    color: #66e9ff;
  `,
  priority1OverLimit: css`
    color: #66d1ff;
  `,
  priority2OverLimit: css`
    color: #8eadff;
  `,
  priority3OverLimit: css`
    color: #a6aeff;
  `,
  priority4OverLimit: css`
    color: #bf99ff;
  `,
  priority5OverLimit: css`
    color: #d785ff;
  `,
  batch: css`
    color: #ffa276;
  `,
  added: css`
    color: #f17ecb;
  `,
  limit: css``,
} as const;

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

const linearGradient = css`
  --part-color-1: currentColor;
  --part-color-2: color-mix(in srgb, var(--part-color-1) 85%, white 15%);

  background: repeating-linear-gradient(
      120deg,
      var(--part-color-1),
      var(--part-color-1) 4px,
      var(--part-color-2) 4px,
      var(--part-color-2) 8px
    )
    0px fixed;
`;

type PartProps = {
  $type: GraphPart;
  $width?: number;
  $offset?: number;
  $fade?: boolean;
};

const getPartVariant = (type: GraphPart) => {
  switch (type) {
    case 'active':
    case 'added':
      return css`
        background: currentColor;
      `;
    case 'batch':
      return css<PartProps>`
        position: absolute;
        left: ${({ $offset }) => $offset}%;

        ${linearGradient}
      `;
    case 'limit':
      return css<PartProps>`
        position: absolute;
        z-index: 1;
        width: 2px;
        left: ${({ $offset }) =>
          !$offset ? '1px' : `calc(${$offset}% - 1px)`};

        top: -40%;
        height: 180%;

        --part-color-1: var(--lido-color-text);
        --part-color-2: transparent;
        background: repeating-linear-gradient(
            0deg,
            var(--part-color-1),
            var(--part-color-1) 5px,
            var(--part-color-2) 5px,
            var(--part-color-2) 8px
          )
          0px;

        mix-blend-mode: ${({ theme }) =>
          theme.name === ThemeName.light ? 'multiply' : 'plus-lighter'};
      `;
    default:
      return css`
        ${linearGradient}
      `;
  }
};

export const PartStyle = styled.div<PartProps>`
  display: inline-block;
  height: 100%;
  width: ${({ $width = 100 }) => $width}%;
  opacity: ${({ $fade }) => ($fade ? '0.2' : '1')};
  transition:
    opacity 0.25s ease-in-out,
    left 0.25s ease-in-out,
    width 0.25s ease-in-out;
  position: relative;

  ${({ $type }) => COLOR_VARIANTS[$type] ?? ''}
  ${({ $type }) => getPartVariant($type)}
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

export const ChipStyle = styled.div<{
  $type: GraphPart;
  $loading?: boolean;
}>`
  width: fit-content;
  padding: 0px 4px;
  text-align: center;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  background: color-mix(in srgb, currentColor 15%, transparent);

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;
  ${({ $type }) => COLOR_VARIANTS[$type] ?? ''}

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
