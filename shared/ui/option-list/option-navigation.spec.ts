import {
  getArrowDirection,
  getNextOptionIndex,
  getTabStopIndex,
} from './option-navigation';

describe('getNextOptionIndex', () => {
  it('moves forward to the next enabled item', () => {
    expect(getNextOptionIndex([true, true, true], 0, true)).toBe(1);
  });

  it('moves backward to the previous enabled item', () => {
    expect(getNextOptionIndex([true, true, true], 2, false)).toBe(1);
  });

  it('wraps forward from the last item to the first', () => {
    expect(getNextOptionIndex([true, true, true], 2, true)).toBe(0);
  });

  it('wraps backward from the first item to the last', () => {
    expect(getNextOptionIndex([true, true, true], 0, false)).toBe(2);
  });

  it('skips disabled items', () => {
    expect(getNextOptionIndex([true, false, true], 0, true)).toBe(2);
    expect(getNextOptionIndex([true, false, true], 2, false)).toBe(0);
  });

  it('skips a disabled item at the wrap boundary', () => {
    expect(getNextOptionIndex([false, true, true], 2, true)).toBe(1);
    expect(getNextOptionIndex([true, true, false], 0, false)).toBe(1);
  });

  it('starts at the first enabled item going forward when nothing is selected', () => {
    expect(getNextOptionIndex([false, true, true], -1, true)).toBe(1);
  });

  it('starts at the last enabled item going backward when nothing is selected', () => {
    expect(getNextOptionIndex([true, true, false], -1, false)).toBe(1);
  });

  it('moves off a disabled selected item', () => {
    expect(getNextOptionIndex([true, false, true], 1, true)).toBe(2);
  });

  it('stays on the only enabled item', () => {
    expect(getNextOptionIndex([false, true, false], 1, true)).toBe(1);
  });

  it('returns -1 when no item is enabled', () => {
    expect(getNextOptionIndex([false, false], 0, true)).toBe(-1);
    expect(getNextOptionIndex([], -1, true)).toBe(-1);
  });
});

describe('getTabStopIndex', () => {
  it('uses the selected item', () => {
    expect(getTabStopIndex([true, true], 1)).toBe(1);
  });

  it('falls back to the first enabled item when nothing is selected', () => {
    expect(getTabStopIndex([false, true, true], -1)).toBe(1);
  });

  it('falls back to the first enabled item when the selected one is disabled', () => {
    expect(getTabStopIndex([true, false, true], 1)).toBe(0);
  });

  it('returns -1 when no item is enabled', () => {
    expect(getTabStopIndex([false, false], -1)).toBe(-1);
  });
});

describe('getArrowDirection', () => {
  it('maps down and right to forward', () => {
    expect(getArrowDirection('ArrowDown')).toBe(true);
    expect(getArrowDirection('ArrowRight')).toBe(true);
  });

  it('maps up and left to backward', () => {
    expect(getArrowDirection('ArrowUp')).toBe(false);
    expect(getArrowDirection('ArrowLeft')).toBe(false);
  });

  it('ignores other keys', () => {
    expect(getArrowDirection('Enter')).toBeUndefined();
    expect(getArrowDirection('constructor')).toBeUndefined();
  });
});
