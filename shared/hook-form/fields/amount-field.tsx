import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { RichInput } from 'shared/ui';
import {
  formatAmountInput,
  getMaxButtonState,
  getShownAmount,
  parseAmountInput,
} from './amount-input';
import { FIELD_ERROR_TEST_ID } from './field-error';
import { SingleTokenSelector } from './single-token-selector';
import { useFieldController } from './use-field-controller';
import { useFocusableRef } from './use-focusable-ref';

export const AMOUNT_INPUT_TEST_ID = 'amountInput';
export const MAX_BUTTON_TEST_ID = 'maxBtn';

export type AmountFieldProps = {
  name: string;
  label: ReactNode;
  token: string;
  locked?: boolean;
  /** Shows the Max button; `0n` shows it disabled. The lib hides it while `disabled`. */
  maxValue?: bigint;
  balance?: ReactNode;
  disabled?: boolean;
  tooltip?: ReactNode;
  placeholder?: string;
  showUntouched?: boolean;
  'data-testid'?: string;
};

export const AmountField: FC<AmountFieldProps> = ({
  name,
  label,
  token,
  locked = false,
  maxValue,
  balance,
  disabled,
  tooltip,
  placeholder = '0',
  showUntouched,
  'data-testid': testId = AMOUNT_INPUT_TEST_ID,
}) => {
  const { field, invalid, message } = useFieldController({
    name,
    showUntouched,
  });
  // the label row's tooltip icon is focusable and precedes the input
  const ref = useFocusableRef(field.ref, 'input');
  const [text, setText] = useState(() => formatAmountInput(field.value));
  const max = getMaxButtonState(maxValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = parseAmountInput(event.target.value);
    if (!next) return;
    setText(next.text);
    field.onChange(next.value);
  };

  const handleMax = () => {
    if (maxValue === undefined) return;
    setText(formatAmountInput(maxValue));
    field.onChange(maxValue);
  };

  return (
    <div ref={ref}>
      <RichInput
        locked={locked}
        name={field.name}
        value={
          locked
            ? formatAmountInput(field.value)
            : getShownAmount(text, field.value)
        }
        onChange={locked ? undefined : handleChange}
        onBlur={field.onBlur}
        disabled={disabled || field.disabled}
        placeholder={placeholder}
        label={label}
        labelTooltip={tooltip}
        balance={balance}
        showMaxButton={max.show}
        maxDisabled={max.disabled}
        onMaxClick={handleMax}
        error={invalid}
        errorText={message}
        dataTestId={{
          input: testId,
          error: FIELD_ERROR_TEST_ID,
          maxButton: MAX_BUTTON_TEST_ID,
        }}
        tokenSelector={<SingleTokenSelector token={token} />}
      />
    </div>
  );
};
