import { GRAPH_CONFIG } from './graph-config';
import type { GraphBounds, GraphCalculationParams } from './enhanced-types';

export const calculateGraphBounds = (
  params: GraphCalculationParams,
): GraphBounds => {
  const { active, queue, capacity, fullView } = params;
  const { BACK_OFFSET, POTENTIAL_ADDED } = GRAPH_CONFIG.QUEUE;
  const { LEFT_MARGIN, RIGHT_MARGIN, FULL_WIDTH } = GRAPH_CONFIG.VIEW.BOUNDS;

  const potential =
    params.added < POTENTIAL_ADDED ? POTENTIAL_ADDED : params.added;

  // Calculate start position with back offset
  const activeStart = active < BACK_OFFSET ? 0n : active;
  const startPosition = fullView
    ? 0n
    : activeStart - BACK_OFFSET < 0n
      ? activeStart
      : activeStart - BACK_OFFSET;

  // Calculate end position
  const endKeysPosition = active + queue + potential;
  const endPosition = fullView
    ? endKeysPosition < capacity
      ? capacity
      : endKeysPosition
    : endKeysPosition;

  const range = endPosition - startPosition;

  // Determine display boundaries based on view mode and capacity
  const extraLow = !fullView && capacity < startPosition - range;
  const extraHigh = !fullView && capacity > endPosition + endPosition / 10n;

  const displayStart = fullView
    ? 0
    : extraLow
      ? LEFT_MARGIN
      : startPosition > potential
        ? LEFT_MARGIN
        : 0;

  const displayEnd = fullView
    ? FULL_WIDTH
    : extraHigh
      ? RIGHT_MARGIN
      : FULL_WIDTH;

  const displayRange = displayEnd - displayStart;
  const minSegmentSize = fullView
    ? GRAPH_CONFIG.VIEW.MIN_SIZE_PERCENTAGE.FULL
    : GRAPH_CONFIG.VIEW.MIN_SIZE_PERCENTAGE.NORMAL;

  const farAway = displayStart > 0;

  return {
    startPosition,
    endPosition,
    range,
    displayStart,
    displayEnd,
    displayRange,
    minSegmentSize,
    extraLow,
    extraHigh,
    farAway,
  };
};

export const normalizeToGraphCoordinate = (
  value: bigint,
  bounds: GraphBounds,
): number => {
  const { startPosition, displayStart, displayRange, range } = bounds;

  if (range === 0n) return displayStart;

  const relativePosition = Number(
    ((value - startPosition) * BigInt(displayRange)) / range,
  );
  return relativePosition + displayStart;
};

export const calculateSegmentSize = (
  value: bigint,
  previousOffset: bigint,
  bounds: GraphBounds,
): number => {
  if (value === 0n) return 0;

  const { minSegmentSize } = bounds;
  const previousPosition =
    previousOffset === 0n
      ? 0
      : Math.max(
          minSegmentSize,
          normalizeToGraphCoordinate(previousOffset, bounds),
        );

  const currentPosition = Math.max(
    minSegmentSize,
    normalizeToGraphCoordinate(value + previousOffset, bounds),
  );

  return Math.max(minSegmentSize, currentPosition - previousPosition);
};

export const calculateLimitOffset = (
  capacity: bigint,
  bounds: GraphBounds,
): number => {
  const { FULL_WIDTH } = GRAPH_CONFIG.VIEW.BOUNDS;
  if (bounds.extraLow) return 8;
  if (bounds.extraHigh) return GRAPH_CONFIG.VIEW.BOUNDS.FULL_WIDTH;
  const offset = normalizeToGraphCoordinate(capacity, bounds);
  if (offset < 0) return 0;
  return offset > FULL_WIDTH ? FULL_WIDTH : offset;
};
