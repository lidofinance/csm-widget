import { FC } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import { Counter, Tabs } from 'shared/components';
import { isValidationErrorTypeValidate } from 'shared/hook-form/validation/validation-error';
import {
  DepositDataDrop,
  DepositDataInput,
  DepositDataInputType,
  DepositDataParameters,
  DepositDataParsed,
  useParseDepositData,
} from '../deposit-data';
import { InputMessageStyle, InputWrapper } from '../deposit-data/styles';

export const DepositDataHookForm: FC = () => {
  const [depositData] = useWatch<DepositDataInputType, ['depositData']>({
    name: ['depositData'],
  });

  const hasKeys = depositData.length > 0;

  const { errors } = useFormState<DepositDataInputType>({
    name: ['depositData', 'rawDepositData'],
  });
  const error = errors.rawDepositData || errors.depositData;

  const a = errors['depositData']?.types;
  const errorsCount = hasKeys && a ? Object.keys(a).length : 0;

  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);

  useParseDepositData();

  return (
    <InputWrapper>
      <DepositDataDrop>
        <Tabs
          items={[
            {
              title: 'JSON',
              content: <DepositDataInput />,
            },
            {
              title: 'Parsed',
              extra: <Counter count={errorsCount} warning />,
              disabled: !hasKeys,
              content: <DepositDataParsed />,
            },
            {
              title: 'Parameters',
              disabled: !hasKeys,
              content: <DepositDataParameters />,
            },
          ]}
          error={!!errorMessage}
        />
      </DepositDataDrop>
      {errorMessage && typeof errorMessage === 'string' && (
        <InputMessageStyle data-testid="input-message-error" $bordered>
          {errorMessage}
        </InputMessageStyle>
      )}
    </InputWrapper>
  );
};
