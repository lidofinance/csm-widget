import {
  ChangeEvent,
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

type UseMaskedInputConfig<T> = {
  value: T | null | undefined;
  onChange?: (value: T | null) => void;
  parse: (s: string) => T | null;
  format: (v: T) => string;
  sanitize: (s: string) => string;
  maxValue: T;
  gt: (a: T, b: T) => boolean;
  ref: ForwardedRef<HTMLInputElement>;
};

export const sanitizeDecimal = (value: string): string => {
  let s = value.trim();
  if (s.includes(',')) s = s.replaceAll(',', '.');
  if (s.includes('-')) s = s.replaceAll('-', '');
  if (s === '.') s = '0.';
  return s;
};

export const gtBigint = (a: bigint, b: bigint): boolean => a > b;

export const useMaskedInput = <T>({
  value,
  onChange,
  parse,
  format,
  sanitize,
  maxValue,
  gt,
  ref,
}: UseMaskedInputConfig<T>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultValue = useMemo(() => (value ? format(value) : ''), []);

  const lastInputValue = useRef(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(ref, () => inputRef.current!, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const immutableValue = e.currentTarget.value;
      const caretPosition = e.currentTarget.selectionStart ?? 0;

      let currentValue = sanitize(immutableValue);

      if (currentValue === '') {
        onChange?.(null);
      } else {
        const parsed = parse(currentValue);

        if (parsed === null || parsed === undefined) {
          const rollbackCaretPosition =
            caretPosition -
            Math.min(
              e.currentTarget.value.length - lastInputValue.current.length,
            );
          e.currentTarget.value = lastInputValue.current;
          e.currentTarget.setSelectionRange(
            rollbackCaretPosition,
            rollbackCaretPosition,
          );
          return;
        }

        const cappedValue = gt(parsed, maxValue) ? maxValue : parsed;
        if (gt(parsed, maxValue)) {
          currentValue = format(maxValue);
        }
        onChange?.(cappedValue);
      }

      e.currentTarget.value = currentValue;
      if (currentValue != immutableValue) {
        const rollbackCaretPosition =
          caretPosition - Math.min(immutableValue.length - currentValue.length);
        e.currentTarget.setSelectionRange(
          rollbackCaretPosition,
          rollbackCaretPosition,
        );
      }
      lastInputValue.current = currentValue;
    },
    [onChange, maxValue, parse, format, sanitize, gt],
  );

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (value === undefined || value === null) {
      input.value = '';
    } else {
      const parsedValue = parse(input.value);
      if (parsedValue === null || parsedValue !== value) {
        input.value = format(value);
        lastInputValue.current = input.value;
      }
    }
  }, [value, parse, format]);

  return { inputRef, defaultValue, handleChange };
};
