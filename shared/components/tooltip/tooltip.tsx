import {
  Tooltip as TooltipBase,
  type TooltipProps,
} from '@lidofinance/lido-ui';
import { forwardRef } from 'react';

export type { TooltipProps };

/**
 * Tooltip that is safe to use inside a Modal.
 *
 * lido-ui renders the tooltip popover into a portal (a DOM sibling of the
 * modal), yet React events still bubble through the React tree. A click on the
 * popover therefore reaches the Modal's outside-click handler, whose DOM-based
 * `contains` check treats it as a click outside and closes the modal.
 *
 * Stopping click propagation on the popover keeps the modal open. `onClick`
 * lands on the popover's root element, so this covers its whole box.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ onClick, ...rest }, ref) => (
    <TooltipBase
      ref={ref}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      {...rest}
    />
  ),
);

Tooltip.displayName = 'Tooltip';
