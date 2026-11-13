import { PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';
import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { FIELD_ERROR_TEST_ID } from './field-error';
import {
  formatPercentInput,
  getShownPercent,
  parsePercentInput,
} from './percent-input';
import { PercentSuffixStyle, TrailingInputStyle } from './styles';
import { useFieldController } from './use-field-controller';

export type PercentFieldProps = {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  /** Basis points cap; typed values above it are clamped. */
  maxValue?: bigint;
  /** Overrides the field's own error: highlight only, no message. */
  error?: boolean;
  /** Called after the field value changes, e.g. to clear a sibling error. */
  onChange?: (value: bigint | null) => void;
  disabled?: boolean;
  showUntouched?: boolean;
  'data-testid'?: string;
};

/** Percent input over a basis-points `bigint | null` value. */
export const PercentField: FC<PercentFieldProps> = ({
  name,
  label,
  placeholder = '0.00',
  maxValue = PERCENT_BASIS,
  error,
  onChange,
  disabled,
  showUntouched,
  'data-testid': testId,
}) => {
  const { field, invalid, message } = useFieldController({
    name,
    showUntouched,
  });
  const [text, setText] = useState(() => formatPercentInput(field.value));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = parsePercentInput(event.target.value, maxValue);
    if (!next) return;
    setText(next.text);
    field.onChange(next.value);
    onChange?.(next.value);
  };

  return (
    <TrailingInputStyle
      $trailing
      ref={field.ref}
      name={field.name}
      value={getShownPercent(text, field.value, maxValue)}
      onChange={handleChange}
      onBlur={field.onBlur}
      disabled={disabled || field.disabled}
      inputMode="decimal"
      autoComplete="off"
      placeholder={placeholder}
      label={label}
      icon={<PercentSuffixStyle>%</PercentSuffixStyle>}
      error={error ?? message ?? invalid}
      dataTestId={{ input: testId, error: FIELD_ERROR_TEST_ID }}
    />
  );
};
