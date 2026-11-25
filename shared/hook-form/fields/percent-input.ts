import { formatPercent } from 'utils/format-percent';

export type PercentInput = { text: string; value: bigint | null };

/** Basis points as the input text ("12.50"); empty for no value. */
export const formatPercentInput = (value?: bigint | null): string =>
  value == null ? '' : formatPercent(value, false, 2);

/** Normalizes typed percent text into basis points capped at `maxValue`; `undefined` means the text is rejected. */
export const parsePercentInput = (
  raw: string,
  maxValue: bigint,
): PercentInput | undefined => {
  let text = raw.trim().replaceAll(',', '.').replaceAll('-', '');
  if (text === '.') text = '0.';
  if (text === '') return { text, value: null };
  if (!/^\d*\.?\d{0,2}$/.test(text)) return undefined;

  const num = parseFloat(text);
  const value = Number.isFinite(num) ? BigInt(Math.round(num * 100)) : null;
  if (value === null || value > maxValue) {
    return { text: formatPercentInput(maxValue), value: maxValue };
  }
  return { text, value };
};

// Keeps what the user typed ("10.5") while it still means the field value
export const getShownPercent = (
  text: string,
  value: bigint | null | undefined,
  maxValue: bigint,
): string =>
  parsePercentInput(text, maxValue)?.value === (value ?? null)
    ? text
    : formatPercentInput(value);
