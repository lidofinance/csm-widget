export const getArrowDirection = (key: string): boolean | undefined => {
  if (key === 'ArrowDown' || key === 'ArrowRight') return true;
  if (key === 'ArrowUp' || key === 'ArrowLeft') return false;
  return undefined;
};

export const getNextOptionIndex = (
  enabled: boolean[],
  current: number,
  forward: boolean,
): number => {
  const count = enabled.length;
  if (!enabled.some(Boolean)) return -1;

  let index = current >= 0 && current < count ? current : forward ? -1 : count;
  for (let step = 0; step < count; step++) {
    index = (index + (forward ? 1 : -1) + count) % count;
    if (enabled[index]) return index;
  }
  return -1;
};

export const getTabStopIndex = (enabled: boolean[], current: number): number =>
  enabled[current] ? current : enabled.indexOf(true);
