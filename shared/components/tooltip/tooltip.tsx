import {
  Tooltip as TooltipBase,
  type TooltipProps as BaseTooltipProps,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';

type LegacyPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'right';

export type TooltipProps = Omit<
  BaseTooltipProps,
  'content' | 'position' | 'title'
> & {
  title?: ReactNode;
  content?: ReactNode;
  placement?: LegacyPlacement;
  position?: BaseTooltipProps['position'];
};

const POSITIONS: Record<LegacyPlacement, BaseTooltipProps['position']> = {
  top: 'top',
  topLeft: 'top-left',
  topRight: 'top-right',
  bottom: 'bottom',
  bottomLeft: 'bottom-left',
  bottomRight: 'bottom-right',
  left: 'left',
  right: 'right',
};

export const Tooltip: FC<TooltipProps> = ({
  title,
  content,
  placement,
  position,
  ...rest
}) => (
  <TooltipBase
    content={content ?? title}
    position={position ?? (placement && POSITIONS[placement])}
    {...rest}
  />
);
