import { CSSProperties } from 'react';
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

export const getPartStyle = (
  type: GraphPart,
  width?: number,
  offset?: number,
) => {
  const style: Record<string, string> = {
    '--part-color': getPartColor(type),
    '--part-width': `${width ?? 100}%`,
  };
  if (type === 'limit') {
    const left = offset ?? 50;
    style['--part-offset'] = !left ? '1px' : `calc(${left}% - 1px)`;
  } else if (offset !== undefined) {
    style['--part-offset'] = `${offset}%`;
  }
  return style as CSSProperties;
};
