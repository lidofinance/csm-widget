import {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  MouseEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import { Input } from '@lidofinance/lido-ui';

import { InputDecoratorLocked } from './input-decorator-locked';
import { InputDecoratorMaxButton } from './input-decorator-max-button';
import { StyledInput } from './styles';

type InputAmountProps = {
  onChange?: (value: number | null) => void;
  value?: number | null;
  onMaxClick?: (event: MouseEvent<HTMLButtonElement>, maxValue: number) => void;
  maxValue?: number;
  isLocked?: boolean;
  isLoading?: boolean;
} & Omit<ComponentProps<typeof Input>, 'onChange' | 'value'>;

const parseNumber = (value: string) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const InputNumber = forwardRef<HTMLInputElement, InputAmountProps>(
  (
    {
      onChange,
      value,
      onMaxClick,
      rightDecorator,
      isLocked,
      isLoading,
      maxValue,
      placeholder = '0',
      ...props
    },
    ref,
  ) => {
    const defaultValue = value?.toString() ?? '';

    const lastInputValue = useRef(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useImperativeHandle(ref, () => inputRef.current!, []);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        // will accumulate changes without committing to dom
        let currentValue = e.currentTarget.value;
        const immutableValue = e.currentTarget.value;
        const caretPosition = e.currentTarget.selectionStart ?? 0;

        currentValue = currentValue.trim();

        // delete negative sign
        if (currentValue.includes('-')) {
          currentValue = currentValue.replaceAll('-', '');
        }

        // Delete decimal delimiter
        if (currentValue.includes(',')) {
          currentValue = currentValue.replaceAll(',', '');
        }
        if (currentValue.includes('.')) {
          currentValue = currentValue.replaceAll('.', '');
        }

        if (currentValue === '') {
          onChange?.(null);
        } else {
          const value = parseNumber(currentValue);
          // invalid value, so we rollback to last valid value
          if (!value) {
            const rollbackCaretPosition =
              caretPosition -
              Math.min(
                e.currentTarget.value.length - lastInputValue.current.length,
              );
            // rollback value (caret moves to end)
            e.currentTarget.value = lastInputValue.current;
            // rollback caret
            e.currentTarget.setSelectionRange(
              rollbackCaretPosition,
              rollbackCaretPosition,
            );
            return;
          }

          const cappedValue =
            value > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : value;
          if (value > Number.MAX_SAFE_INTEGER) {
            currentValue = Number.MAX_SAFE_INTEGER.toString();
          }
          onChange?.(cappedValue);
        }

        // commit change to dom
        e.currentTarget.value = currentValue;
        // if there is a diff due to soft change, adjust caret to remain in same place
        if (currentValue != immutableValue) {
          const rollbackCaretPosition =
            caretPosition -
            Math.min(immutableValue.length - currentValue.length);
          e.currentTarget.setSelectionRange(
            rollbackCaretPosition,
            rollbackCaretPosition,
          );
        }
        lastInputValue.current = currentValue;
      },
      [onChange],
    );

    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      if (!value) {
        input.value = '';
      } else {
        const parsedValue = parseNumber(input.value);
        // only change string state if casted values differ
        // this allows user to enter 0.100 without immediate change to 0.1
        if (!parsedValue || parsedValue !== value) {
          input.value = value.toString();
          // prevents rollback to incorrect value in onChange
          lastInputValue.current = input.value;
        }
      }
    }, [value]);

    const handleClickMax =
      onChange && maxValue && maxValue > 0
        ? (event: MouseEvent<HTMLButtonElement>) => {
            onChange(maxValue);
            onMaxClick?.(event, maxValue);
          }
        : undefined;

    return (
      <StyledInput
        {...props}
        placeholder={placeholder}
        rightDecorator={
          rightDecorator ?? (
            <>
              {maxValue !== undefined ? (
                <InputDecoratorMaxButton
                  onClick={handleClickMax}
                  disabled={!handleClickMax}
                />
              ) : undefined}
              {isLocked ? <InputDecoratorLocked /> : undefined}
            </>
          )
        }
        disabled={props.disabled || isLocked}
        inputMode="numeric"
        defaultValue={defaultValue}
        onChange={handleChange}
        ref={inputRef}
      />
    );
  },
);
