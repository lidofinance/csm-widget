import { ComponentProps, forwardRef } from 'react';
import { Input } from '@lidofinance/lido-ui';
import { PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';

import { formatPercent } from 'utils';

import { InputDecoratorLocked } from './input-decorator-locked';
import { StyledInput } from './styles';
import { useMaskedInput, sanitizeDecimal, gtBigint } from './use-masked-input';

const percentToBpSafe = (value: string): bigint | null => {
  if (!/^\d*\.?\d{0,2}$/.test(value)) return null;
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return null;
  return BigInt(Math.round(num * 100));
};

type InputPercentProps = {
  onChange?: (value: bigint | null) => void;
  value?: bigint | null;
  maxValue?: bigint;
  isLocked?: boolean | string;
  isLoading?: boolean;
} & Omit<ComponentProps<typeof Input>, 'onChange' | 'value'>;

export const InputPercent = forwardRef<HTMLInputElement, InputPercentProps>(
  (
    {
      onChange,
      value,
      rightDecorator,
      isLocked,
      isLoading,
      maxValue = PERCENT_BASIS,
      placeholder = '0',
      ...props
    },
    ref,
  ) => {
    const { inputRef, defaultValue, handleChange } = useMaskedInput({
      value,
      onChange,
      ref,
      parse: percentToBpSafe,
      format: (v) => formatPercent(v, false, 2),
      sanitize: sanitizeDecimal,
      maxValue,
      gt: gtBigint,
    });

    return (
      <StyledInput
        {...props}
        placeholder={placeholder}
        rightDecorator={
          rightDecorator ??
          (isLocked ? (
            <InputDecoratorLocked
              title={typeof isLocked === 'string' ? isLocked : undefined}
            />
          ) : undefined)
        }
        disabled={props.disabled || !!isLocked}
        inputMode="decimal"
        defaultValue={defaultValue}
        onChange={handleChange}
        ref={inputRef}
      />
    );
  },
);
