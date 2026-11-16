import { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { GraphPart } from './types';

const PART_COLORS: Partial<Record<GraphPart, string>> = {
  active: '#53ba95',
  queue: '#00a3ff',
  priority0: '#00cfff',
  priority1: '#007fff',
  priority2: '#0046ff',
  priority3: '#002db3',
  priority4: '#6e0eff',
  priority5: '#c747ff',
  queueOverLimit: '#81d1ff',
  priority0OverLimit: '#66e7ff',
  priority1OverLimit: '#66bfff',
  priority2OverLimit: '#668aff',
  priority3OverLimit: '#6685cc',
  priority4OverLimit: '#9966ff',
  priority5OverLimit: '#da85ff',
  batch: '#ffa276',
  added: '#ff8d47ff',
};

const getPartColor = (type: GraphPart) => PART_COLORS[type] ?? 'currentColor';

export const getPartColors = (type: GraphPart) => {
  const color = getPartColor(type);
  return {
    '--lido-app-ui-tag-color': color,
    '--lido-app-ui-tag-background': `color-mix(in srgb, ${color} 15%, transparent)`,
    '--lido-app-ui-tag-border-color': 'transparent',
  } as CSSProperties;
};

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
    var(--lido-app-ui-color-background-surface) 15%,
    rgba(255, 255, 255, 0) 80%
  );
`;

export const LineStyle = styled.div`
  height: 10px;
  width: 100%;
  border-radius: 10px;
  background: var(--lido-app-ui-color-background-secondary);
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
        left: ${({ $offset = 50 }) =>
          !$offset ? '1px' : `calc(${$offset}% - 1px)`};

        top: -40%;
        height: 180%;

        --part-color-1: var(--lido-app-ui-color-text-default);
        --part-color-2: transparent;
        background: repeating-linear-gradient(
            0deg,
            var(--part-color-1),
            var(--part-color-1) 5px,
            var(--part-color-2) 5px,
            var(--part-color-2) 8px
          )
          0px;

        mix-blend-mode: multiply;

        [data-lido-theme='dark'] & {
          mix-blend-mode: plus-lighter;
        }
      `;
    default:
      return css`
        ${linearGradient}
      `;
  }
};

export const PartStyle = styled.div<PartProps>`
  display: inline-block;
  vertical-align: top;
  height: 100%;
  width: ${({ $width = 100 }) => $width}%;
  opacity: ${({ $fade }) => ($fade ? '0.2' : '1')};
  transition:
    opacity 0.25s ease-in-out,
    left 0.25s ease-in-out,
    width 0.25s ease-in-out;
  position: relative;

  color: ${({ $type }) => getPartColor($type)};
  ${({ $type }) => getPartVariant($type)}
`;

export const CircleStyle = styled(LineStyle)`
  width: 10px;
`;

export const LegendStyle = styled.div`
  cursor: pointer;
`;

export const LegendsStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
`;

export const GraphStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 4px;
  overflow-x: auto;
`;

export const TooltipContentStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;
