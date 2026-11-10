export type NumberInput = { text: string; value: number | undefined };

export type NumberRange = {
  min?: number;
  max?: number;
  minMessage?: string;
  maxMessage?: string;
};

/** Normalizes typed text into a number; `undefined` means the text is rejected. */
export const parseNumberInput = (
  raw: string,
  decimals = 0,
): NumberInput | undefined => {
  let text = raw.trim().replaceAll(',', '.').replaceAll('-', '');
  if (text === '') return { text, value: undefined };
  if (decimals > 0 && text === '.') text = '0.';
  const fraction = decimals > 0 ? '\\.?\\d{0,' + decimals + '}' : '';
  const pattern = new RegExp('^\\d*' + fraction + '$');
  if (!pattern.test(text)) return undefined;

  const value = parseFloat(text);
  return { text, value: Number.isFinite(value) ? value : undefined };
};

// Keeps what the user typed ("0.") while it still means the field value
export const getShownNumber = (
  text: string,
  value: number | undefined,
  decimals = 0,
): string => {
  if (parseNumberInput(text, decimals)?.value === value) return text;
  return value === undefined ? '' : String(value);
};

/** Range violation message; empty value never violates. */
export const getNumberRangeError = (
  value: number | undefined,
  { min, max, minMessage, maxMessage }: NumberRange,
): string | undefined => {
  if (value === undefined) return undefined;
  if (min !== undefined && value < min) {
    return minMessage ?? `Minimum value is ${min}`;
  }
  if (max !== undefined && value > max) {
    return maxMessage ?? `Maximum value is ${max}`;
  }
  return undefined;
};
