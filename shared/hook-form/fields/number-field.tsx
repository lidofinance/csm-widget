import { InputProps } from '@lidofinance/lido-app-ui';
import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { FIELD_ERROR_TEST_ID } from './field-error';
import {
  getNumberRangeError,
  getShownNumber,
  NumberRange,
  parseNumberInput,
} from './number-input';
import { TrailingInputStyle } from './styles';
import { useFieldController } from './use-field-controller';

export type NumberFieldProps = NumberRange &
  Omit<
    InputProps,
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'error'
    | 'label'
    | 'icon'
    | 'type'
    | 'min'
    | 'max'
  > & {
    name: string;
    label?: ReactNode;
    /** Max fractional digits; integers only by default. */
    decimals?: number;
    showUntouched?: boolean;
    /** Rendered after the input, e.g. a tag or unit. */
    trailing?: ReactNode;
  };

/** Numeric input over a `number | undefined` value. */
export const NumberField: FC<NumberFieldProps> = ({
  name,
  label,
  min,
  max,
  minMessage,
  maxMessage,
  decimals = 0,
  showUntouched,
  trailing,
  disabled,
  dataTestId,
  ...rest
}) => {
  const range = { min, max, minMessage, maxMessage };
  const { field, invalid, message } = useFieldController({
    name,
    showUntouched,
    rules: { validate: (value) => getNumberRangeError(value, range) ?? true },
  });
  const [text, setText] = useState(() =>
    field.value == null ? '' : String(field.value),
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = parseNumberInput(event.target.value, decimals);
    if (!next) return;
    setText(next.text);
    field.onChange(next.value);
  };

  const rangeMessage = getNumberRangeError(field.value, range);

  return (
    <TrailingInputStyle
      $trailing={!!trailing}
      icon={trailing}
      autoComplete="off"
      {...rest}
      ref={field.ref}
      name={field.name}
      value={getShownNumber(text, field.value, decimals)}
      onChange={handleChange}
      onBlur={field.onBlur}
      inputMode={decimals > 0 ? 'decimal' : 'numeric'}
      label={label}
      disabled={disabled || field.disabled}
      error={message ?? rangeMessage ?? invalid}
      dataTestId={{ ...dataTestId, error: FIELD_ERROR_TEST_ID }}
    />
  );
};
