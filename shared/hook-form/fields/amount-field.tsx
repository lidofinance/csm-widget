import {
  isTokenIcon,
  TokenIcon,
  TokenSelector,
} from '@lidofinance/lido-app-ui';
import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { RichInput } from 'shared/ui';
import {
  formatAmountInput,
  getShownAmount,
  parseAmountInput,
} from './amount-input';
import { FIELD_ERROR_TEST_ID } from './field-error';
import { useFieldController } from './use-field-controller';
import { useFocusableRef } from './use-focusable-ref';

export const AMOUNT_INPUT_TEST_ID = 'amountInput';

export type AmountFieldProps = {
  name: string;
  label: ReactNode;
  token: string;
  locked?: boolean;
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = parseAmountInput(event.target.value);
    if (!next) return;
    setText(next.text);
    field.onChange(next.value);
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
        placeholder={placeholder}
        label={label}
        labelTooltip={tooltip}
        showMaxButton={false}
        error={invalid}
        errorText={message}
        dataTestId={{ input: testId, error: FIELD_ERROR_TEST_ID }}
        tokenSelector={
          <TokenSelector
            single
            value={token}
            options={[
              {
                value: token,
                label: token,
                icon: isTokenIcon(token) ? (
                  <TokenIcon token={token} />
                ) : undefined,
              },
            ]}
          />
        }
      />
    </div>
  );
};
