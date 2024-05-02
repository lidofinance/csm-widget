import { useController, useFormState, useFormContext } from 'react-hook-form';
import { SelectIcon, Option, OptionValue } from '@lidofinance/lido-ui';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { isValidationErrorTypeValidate } from 'shared/hook-form/validation/validation-error';
import { TOKENS } from 'consts/tokens';

import { ReactComponent as EthIcon } from 'assets/icons/eth.svg';
import { ReactComponent as StethIcon } from 'assets/icons/steth.svg';
import { ReactComponent as WstethIcon } from 'assets/icons/wsteth.svg';

export type TokenOption = {
  label?: string;
  token: TOKENS;
};

const OPTIONS: TokenOption[] = [
  { token: TOKENS.ETH },
  { token: TOKENS.STETH },
  { token: TOKENS.WSTETH },
];

// TODO: 24px
const iconsMap = {
  [TOKENS.ETH]: <EthIcon />,
  [TOKENS.STETH]: <StethIcon />,
  [TOKENS.WSTETH]: <WstethIcon />,
} as const;

type TokenSelectHookFormProps = {
  options?: TokenOption[];
  fieldName?: string;
  resetField?: string;
  errorField?: string;
  onChange?: (value: TOKENS) => void;
  warning?: boolean;
};

export const TokenSelectHookForm = ({
  options = OPTIONS,
  fieldName = 'token',
  resetField = 'amount',
  errorField = 'amount',
  onChange,
  warning,
}: TokenSelectHookFormProps) => {
  const { field } = useController<Record<string, TOKENS>>({ name: fieldName });
  const { setValue, clearErrors } = useFormContext();

  const { errors, defaultValues } = useFormState<Record<string, unknown>>({
    name: errorField,
  });

  return (
    <SelectIcon
      {...field}
      warning={warning}
      icon={iconsMap[field.value]}
      error={isValidationErrorTypeValidate(errors[errorField]?.type)}
      onChange={(value: OptionValue) => {
        setValue(fieldName, value, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
        setValue(resetField, defaultValues?.[resetField], {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
        clearErrors(resetField);
        onChange?.(value as TOKENS);
      }}
    >
      {options.map(({ label, token }) => (
        <Option key={token} leftDecorator={iconsMap[token]} value={token}>
          {label || getTokenDisplayName(token)}
        </Option>
      ))}
    </SelectIcon>
  );
};
