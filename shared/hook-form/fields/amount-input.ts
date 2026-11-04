import { formatEther, parseEther } from 'viem';

export type AmountInput = { text: string; value: bigint | null };

export const formatAmountInput = (value?: bigint | null): string =>
  value == null ? '' : formatEther(value);

/** Normalizes typed text into an ether amount; `undefined` means the text is rejected. */
export const parseAmountInput = (raw: string): AmountInput | undefined => {
  let text = raw.trim().replaceAll(',', '.').replaceAll('-', '');
  if (text === '.') text = '0.';
  if (text === '') return { text, value: null };
  if (!/^\d*\.?\d{0,18}$/.test(text)) return undefined;

  try {
    return { text, value: parseEther(text) };
  } catch {
    return undefined;
  }
};

// Keeps what the user typed ("0.10") while it still means the field value
export const getShownAmount = (text: string, value?: bigint | null): string =>
  parseAmountInput(text)?.value === (value ?? null)
    ? text
    : formatAmountInput(value);

export type MaxButtonState = { show: boolean; disabled: boolean };

// Mirrors legacy InputAmount: no max → no button; a zero max shows it disabled
export const getMaxButtonState = (maxValue?: bigint): MaxButtonState => ({
  show: maxValue !== undefined,
  disabled: !(maxValue !== undefined && maxValue > 0n),
});
